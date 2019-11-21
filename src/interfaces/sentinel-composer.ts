import { ISentinelValidatorFn } from "./sentinel-validator-fn";

export interface ISentinelComposer {
  any: ISentinelValidatorFn[];
  all: ISentinelValidatorFn[];
}
