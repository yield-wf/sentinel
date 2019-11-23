import { ISentinelValidatorFn } from "./sentinel-validator-fn";

export interface ISentinelValidatorComposer {
  any: null | ISentinelValidatorFn[];
  all: null | ISentinelValidatorFn[];
}
