import { ISentinelValidatorComposer } from './interfaces/sentinel-composer';
import { ISentinelValidatorFn } from './interfaces/sentinel-validator-fn';


export class SentinelHelpers {
  public errors: any[] = [];
  public valid: boolean = false;

  protected static _castFn(fn, defaultValue = undefined) {
    return ~Object.prototype.toString.call(fn).indexOf("Function")
      ? fn
      : () => defaultValue;
  }

  protected static _exists(value: any): boolean {
    return typeof value !== "undefined" && value !== null;
  }

  protected static _get(
    obj: any,
    path: string,
    defaultValue = undefined,
    justExistence = false
  ): any {
    if (!path) return undefined;
    const tree = path.split(/(?:\[|\]|\]?\.)/i).filter(i => i !== "");
    let fullDepth = obj || {};
    while (tree.length) {
      const currentDepth = tree.shift();
      if (fullDepth[currentDepth]) {
        fullDepth = fullDepth[currentDepth];
      } else {
        tree.splice(0);
        return defaultValue;
      }
    }
    return justExistence ? SentinelHelpers._exists(fullDepth) : fullDepth;
  }

  protected static _hasIn(obj: any, path: string) {
    return SentinelHelpers._get(obj, path, undefined, true);
  }

  protected static _toString(value: any): string {
    return SentinelHelpers._hasIn(value, "toString") ? value.toString() : "";
  }

  constructor(data: any, ...validators: (ISentinelValidatorComposer | ISentinelValidatorFn | any)[]) {
    const validatorsArr = Array.prototype.concat.apply([], validators);
    const [first = {}] = validatorsArr;
    if (Array.isArray(first.all)) {
      let failed = false;
      first.all.forEach(validator => {
        if (failed) return;
        // validator
        this.valid = SentinelHelpers._castFn(validator, {
          validate: () => false
        })().validate(data);
        if (!this.valid) failed = true;
      });
    } else if (Array.isArray(first.any)) {
      let validFound = false;
      first.any.forEach(validator => {
        if (validFound) return;
        this.valid = SentinelHelpers._castFn(validator, {
          validate: () => false
        })().validate(data);
        validFound = this.valid;
      });
    } else if (Array.isArray(validatorsArr)) {
      let failed = false;
      validatorsArr.forEach(validator => {
        if (failed) return;
        this.valid = SentinelHelpers._castFn(validator, {
          validate: () => false
        })().validate(data);
        if (!this.valid) failed = true;
      });
    } else {
      this.valid = false;
    }
  }

  isValid() {
    return this.valid;
  }

  isInvalid() {
    return !this.valid;
  }
}
