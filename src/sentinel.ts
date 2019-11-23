import {
    Injectable
} from '@nestjs/common';
import moment from "moment";
import {
    SentinelHelpers
} from "./sentinel-helpers";
import {
    ISentinelValidator
} from './interfaces/sentinel-validator';
import {
    ISentinelValidatorFn
} from "./interfaces/sentinel-validator-fn";
import {
    ISentinelValidatorComposer
} from "./interfaces/sentinel-composer";
import {
    ISentinelValidatorDelegate
} from "./interfaces/sentinel-validator-delegate";

export class Sentinel extends SentinelHelpers {
    constructor(data: any, ...validators: any) {
        super(data, ...validators);
    }

    public static any(
        ...validators: (ISentinelValidator | ISentinelValidatorFn | ISentinelValidatorComposer)[]
    ): ISentinelValidatorComposer {
        return {
            any: Array.prototype.concat.apply([], validators),
            all: null
        };
    }

    public static all(
        ...validators: (ISentinelValidator | ISentinelValidatorFn | ISentinelValidatorComposer)[]
    ): ISentinelValidatorComposer {
        return {
            all: Array.prototype.concat.apply([], validators),
            any: null
        };
    }

    /**
     * Is primitive value present in array?
     * @param {Array} arr - Array de valores
     */
    public static inArray < ISentinelValidator > (
        arr: (string | number | boolean)[]
    ): ISentinelValidatorDelegate {
        return (): ISentinelValidatorFn => ({
            validate(value: string | number | boolean): boolean {
                return arr.indexOf(value) !== -1;
            }
        });
    }

    /**
     * Is value numeric?
     */
    public static isNumber < ISentinelValidator > (): ISentinelValidatorFn {
        return {
            validate(value: any): boolean {
                return (
                    typeof value === "number" ||
                    value === "0" ||
                    (typeof value !== "boolean" && (value | 0) !== 0)
                );
            }
        };
    }

    /**
     * Is value present?
     */
    public static isRequired < ISentinelValidator > (): ISentinelValidatorFn {
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
    public static isPresent < ISentinelValidator > (): ISentinelValidatorFn {
        return Sentinel.isRequired();
    }

    /**
     * Alias for isRequired
     * Is value present?
     */
    public static hasValue < ISentinelValidator > (): ISentinelValidatorFn {
        return Sentinel.isRequired();
    }

    /**
     * Has minimum length?
     * @param {number} min - Limite mínimo
     */
    public static hasMinLength < ISentinelValidator > (min: number): ISentinelValidatorDelegate {
        return (): ISentinelValidatorFn => ({
            validate(value): boolean {
                return Sentinel._toString(value).length >= (min | 0);
            }
        });
    }

    /**
     * Respects maximum length?
     * @param {number} max - Maximum length
     */
    public static hasMaxLength < ISentinelValidator > (max: number): ISentinelValidatorDelegate {
        return (): ISentinelValidatorFn => ({
            validate(value): boolean {
                return Sentinel._toString(value).length <= (max | 0);
            }
        });
    }

    /**
     * Between minimum and maximum length?
     * @param {number} min - Minimum length
     * @param {number} max - Maximum length
     */
    public static hasMinMaxLength < ISentinelValidator > (
        min: number,
        max: number
    ): ISentinelValidatorDelegate {
        return (): ISentinelValidatorFn => ({
            validate(value): boolean {
                return Sentinel.hasMinLength(min)().validate(value) && Sentinel.hasMaxLength(max)().validate(value);
            }
        });
    }

    /**
     * Has exact length?
     * @param {number} size - Tamanho
     */
    public static hasExactLength < ISentinelValidator > (size): ISentinelValidatorDelegate {
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
    public static isLessThan < ISentinelValidator > (
        comparer: number,
        allowEquals: boolean = false
    ): ISentinelValidatorDelegate {
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
    public static isLessOrEqualThan < ISentinelValidator > (
        comparer: number
    ): ISentinelValidatorDelegate {
        return (): ISentinelValidatorFn => ({
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
    public static isGreaterThan < ISentinelValidator > (
        comparer: number,
        allowEquals: boolean = false
    ): ISentinelValidatorDelegate {
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
    public static isGreaterOrEqualThan < ISentinelValidator > (
        comparer: number
    ): ISentinelValidatorDelegate {
        return (): ISentinelValidatorFn => ({
            validate(value) {
                return Sentinel.isGreaterThan(comparer, true)().validate(value);
            }
        });
    }

    /**
     * Is valid RFC 5322 email address?
     * @param {string} email - Email
     */
    public static isEmail < ISentinelValidator > (): ISentinelValidatorFn {
        return {
            validate(email: any): boolean {
                return /^(?=[a-z0-9@.!#$%&'*+\/=?^_`{|}~-]{6,254}$)(?=[a-z0-9.!#$%&'*+\/=?^_`{|}~-]{1,64}@)[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:(?=[a-z0-9-]{1,63}\.)[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?=[a-z0-9-]{1,63}$)[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(
                    Sentinel._toString(email)
                );
            }
        };
    }

    /**
     * Is valid date?
     * @param {string} [format] - Date format (opcional)
     */
    public static isDate < ISentinelValidator > (format: string | undefined): ISentinelValidatorDelegate {
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
    private static isDateGreaterThan < ISentinelValidator > (
        dateToCompare,
        format = undefined
    ): ISentinelValidatorDelegate {
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
    public static isPasswordValid < ISentinelValidator > () // minLength: number = 8,
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
    private static isCpfValid < ISentinelValidator > (required = true): ISentinelValidatorDelegate {
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
    public static isUSZipCodeValid < ISentinelValidator > (): ISentinelValidatorDelegate {
        return (): ISentinelValidatorFn => ({
            validate(zipCode: string): boolean {
                return /^[0-9]{5}(?:-[0-9]{4})?$/i.test(zipCode);
            }
        });
    }

    /**
     * Is valid BR zip code?
     */
    public static isBRZipCodeValid < ISentinelValidator > (): ISentinelValidatorDelegate {
        return (): ISentinelValidatorFn => ({
            validate(zipCode: string): boolean {
                return /^[0-9]{5}(?:-?[0-9]{3})$/i.test(zipCode);
            }
        });
    }

    /**
     * Is valid zip code?
     */
    public static isZipCodeValid < ISentinelValidator > () {
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

@Injectable()
export class SentinelService {
    constructor() {
        return Sentinel
    }
}