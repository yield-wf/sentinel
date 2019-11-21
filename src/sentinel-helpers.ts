export class SentinelHelpers {
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
      return SentinelHelpers._hasIn(value, 'toString') ? value.toString() : ''
  }
}
