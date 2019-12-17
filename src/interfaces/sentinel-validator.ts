import { ISentinelValidatorFn } from "./sentinel-validator-fn";
import { ISentinelValidatorDelegate } from "./sentinel-validator-delegate";

export interface ISentinelValidator {
    (): ISentinelValidatorFn | ISentinelValidatorDelegate
}