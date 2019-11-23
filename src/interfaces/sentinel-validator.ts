import { ISentinelValidatorFn } from "../iSentinelValidator";
import { ISentinelValidatorDelegate } from "./sentinel-validator-delegate";

export interface ISentinelValidator {
    (): ISentinelValidatorFn | ISentinelValidatorDelegate
}