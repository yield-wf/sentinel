import moment from "moment";

import { SentinelHelpers } from "./sentinel-helpers";
import { ISentinelValidatorFn } from "./interfaces/sentinel-validator-fn";
import { ISentinelComposer } from "./interfaces/sentinel-composer";

export class Sentinel extends SentinelHelpers {
  errors: any[] = [];
  valid: boolean = false;

  constructor(
    data: any,
    ...validators: (ISentinelComposer | ISentinelValidatorFn)[]
  ) {
    super();
    const validatorsArr = Array.prototype.concat.apply([], validators);
    const [first = {}] = validatorsArr;
    if (Array.isArray(first.all)) {
      let failed = false;
      first.all.forEach(validator => {
        if (failed) return;
        this.valid = Sentinel._castFn(validator, {
          validate: () => false
        })().validate(data);
        if (!this.valid) failed = true;
      });
    } else if (Array.isArray(first.any)) {
      let validFound = false;
      first.any.forEach(validator => {
        if (validFound) return;
        this.valid = Sentinel._castFn(validator, {
          validate: () => false
        })().validate(data);
        validFound = this.valid;
      });
    } else if (Array.isArray(validatorsArr)) {
      let failed = false;
      validatorsArr.forEach(validator => {
        if (failed) return;
        this.valid = Sentinel._castFn(validator, {
          validate: () => false
        })().validate(data);
        if (!this.valid) failed = true;
      });
    } else {
      this.valid = false;
    }
  }

  public static any(...validators: ISentinelValidatorFn[]): ISentinelComposer {
    return { any: Array.prototype.concat.apply([], validators), all: null };
  }

  public static all(...validators: ISentinelValidatorFn[]): ISentinelComposer {
    return { all: Array.prototype.concat.apply([], validators), any: null };
  }

  /**
   * Is primitive value present in array?
   * @param {Array} arr - Array de valores
   */
  public static inArray(arr: (string | number | boolean)[]) {
    return (): ISentinelValidatorFn => ({
      validate(value: string | number | boolean): boolean {
        return !!~arr.indexOf(value);
      }
    });
  }

  /**
   * Is value numeric?
   */
  public static isNumber(): ISentinelValidatorFn {
    return {
      validate(value: any): boolean {
        return (
          typeof value === "number" ||
          value === "0" ||
          (typeof value !== "boolean" && (value | 0) > 0)
        );
      }
    };
  }

  /**
   * Is value present?
   */
  public static isRequired(): ISentinelValidatorFn {
    return {
      validate(value: any): boolean {
        return typeof value !== "undefined" && value !== null;
      }
    };
  }

  /**
   * Alias for isRequired
   * Is value present?
   */
  public static isPresent(): ISentinelValidatorFn {
    return Sentinel.isRequired();
  }

  /**
   * Alias for isRequired
   * Is value present?
   */
  public static hasValue(): ISentinelValidatorFn {
    return Sentinel.isRequired();
  }

  /**
   * Has minimum length?
   * @param {number} min - Limite mínimo
   */
  public static hasMinLenght(min: number) {
    return (): ISentinelValidatorFn => ({
      validate(value): boolean {
        if (!Sentinel._hasIn(value, "toString")) return false;
        const valueStr = Sentinel._castFn(value.toString, "")();
        return valueStr.length >= (min | 0);
      }
    });
  }

  /**
   * Respects maximum length?
   * @param {number} max - Maximum length
   */
  public static hasMaxLength(max: number) {
    return (): ISentinelValidatorFn => ({
      validate(value): boolean {
        if (!Sentinel._hasIn(value, "toString")) return false;
        const valueStr = Sentinel._castFn(value.toString, "")();
        return valueStr.length <= (max | 0);
      }
    });
  }

  /**
   * Between minimum and maximum length?
   * @param {number} min - Minimum length
   * @param {number} max - Maximum length
   */
  public static hasMinMaxLength(min: number, max: number) {
    return (): ISentinelValidatorFn => ({
      validate(value): boolean {
        return (
          Sentinel.hasMinLenght(min)().validate(value) &&
          Sentinel.hasMaxLength(max)().validate(value)
        );
      }
    });
  }

  /**
   * Has exact length?
   * @param {number} size - Tamanho
   */
  public static hasExactLength(size) {
    return (): ISentinelValidatorFn => ({
      validate(value): boolean {
        const valueStr = Sentinel._toString(value);
        return valueStr.length === (size | 0);
      }
    });
  }

  /**
   * Is less than?
   * @param {number} comparer
   * @param {boolean} [allowEquals]
   */
  public static isLessThan(comparer: number, allowEquals: boolean = false) {
    return (): ISentinelValidatorFn => ({
      validate(value): boolean {
        return allowEquals ? value <= comparer : value < comparer;
      }
    });
  }

  /**
   * Is less than or equal?
   * @param {number} comparer
   */
  public static isLessOrEqualThan(comparer: number) {
    return (value): ISentinelValidatorFn => ({
      validate(value) {
        return Sentinel.isLessThan(comparer, true)().validate(value);
      }
    });
  }

  /**
   * Is greater than?
   * @param {number} comparer
   * @param {boolean} [allowEquals]
   */
  public static isGreaterThan(comparer: number, allowEquals: boolean = false) {
    return (): ISentinelValidatorFn => ({
      validate(value): boolean {
        return allowEquals ? value >= comparer : value > comparer;
      }
    });
  }

  /**
   * Is greater than or equal?
   * @param {number} comparer
   */
  public static isGreaterOrEqualThan(comparer: number) {
    return (value): ISentinelValidatorFn => ({
      validate(value) {
        return Sentinel.isGreaterThan(comparer, true)().validate(value);
      }
    });
  }

  /**
   * Is valid RFC 5322 email address?
   * @param {string} email - Email
   */
  public static isEmail() {
    return (): ISentinelValidatorFn => ({
      validate(email): boolean {
        return /^(?=[a-z0-9@.!#$%&'*+\/=?^_`{|}~-]{6,254}$)(?=[a-z0-9.!#$%&'*+\/=?^_`{|}~-]{1,64}@)[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:(?=[a-z0-9-]{1,63}\.)[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?=[a-z0-9-]{1,63}$)[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(
          Sentinel._toString(email)
        );
      }
    });
  }

  /**
   * Is valid date?
   * @param {string} [format] - Date format (opcional)
   */
  public static isDate(format: string | undefined) {
    return (): ISentinelValidatorFn => ({
      validate(date): boolean {
        return moment(date, format).isValid();
      }
    });
  }

  /**
   * Se a primeira data é maior que a segunda
   * @param {string|Date} dateToCompare - Data to compare
   * @param {string} [format] - Formato de data (opcional)
   */
  private static isDateGreaterThan(dateToCompare, format = undefined) {
    return (): ISentinelValidatorFn => ({
      validate(date): boolean {
        return moment(date, format) <= moment(dateToCompare, format);
      }
    });
  }

  /**
   * Passwor complexity (8 chars and minimum 3 of 4 complexity levels: upper+lower+number+special)
   * TODO: Make it full configurable
   */
  public static isPasswordValid() // minLength: number = 8,
  // lowerPresent: boolean = true,
  // upperPresent: boolean = true,
  // numberPresent: boolean = true
  // specialPresent: boolean = true,
  // minimumRules: number = 3
  {
    return (): ISentinelValidatorFn => ({
      validate(password: string): boolean {
        return /^(?:(?=[^\n]*[a-z])(?:(?=[^\n]*[A-Z])(?=[^\n]*[\d\W])|(?=[^\n]*\W)(?=[^\n]*\d))|(?=[^\n]*\W)(?=[^\n]*[A-Z])(?=[^\n]*\d))[^\n]{8,}$/.test(
          Sentinel._toString(password)
        );
      }
    });
  }

  /**
   * Valida número de CPF e previne contra padrões numéricos
   * @param {boolean} required - Se false permite cpf em branco (não informado)
   */
  private static isCpfValid(required = true) {
    return (): ISentinelValidatorFn => ({
      validate(cpf: string): boolean {
        if (required && !cpf) {
          return false;
        }
        const cpfStr = Sentinel._toString(cpf).replace(/[^\d]+/g, "");
        const r = /^(0{11}|1{11}|2{11}|3{11}|4{11}|5{11}|6{11}|7{11}|8{11}|9{11})$/;
        if (
          (required && !cpfStr) ||
          cpfStr.length !== 11 ||
          r.test(cpfStr) ||
          new Array(11).fill(cpfStr.charAt(0)).join("") === cpfStr ||
          cpfStr === "01234567890"
        ) {
          return false;
        }
        function validateDigit(digit) {
          let add = 0;
          const init = digit - 9;
          for (let i = 0; i < 9; i++) {
            add += parseInt(cpfStr.charAt(i + init), 10) * (i + 1);
          }
          return (add % 11) % 10 === parseInt(cpfStr.charAt(digit), 10);
        }
        if (!(validateDigit(9) && validateDigit(10))) {
          return false;
        }
        return true;
      }
    });
  }

  /**
   * Is valid US zip code?
   */
  public static isUSZipCodeValid() {
    return (): ISentinelValidatorFn => ({
      validate(zipCode: string): boolean {
        return /^[0-9]{5}(?:-[0-9]{4})?$/i.test(zipCode);
      }
    });
  }

  /**
   * Is valid BR zip code?
   */
  public static isBRZipCodeValid() {
    return (): ISentinelValidatorFn => ({
      validate(zipCode: string): boolean {
        return /^[0-9]{5}(?:-?[0-9]{3})$/i.test(zipCode);
      }
    });
  }

  /**
   * Is valid zip code?
   */
  public static isZipCodeValid() {
    return (): ISentinelValidatorFn => ({
      validate(zipCode: string): boolean {
        return (
          Sentinel.isUSZipCodeValid()().validate(zipCode) ||
          Sentinel.isBRZipCodeValid()().validate(zipCode)
        );
      }
    });
  }
}
