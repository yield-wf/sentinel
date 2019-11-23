import { ISentinelValidatorFn } from "./sentinel-validator-fn";

export interface ISentinelValidatorDelegate {
  (): ISentinelValidatorFn;
}
