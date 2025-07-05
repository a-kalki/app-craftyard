import { DtoFieldValidator, LiteralFieldValidator, StringChoiceValidationRule, type ValidatorMap } from "rilata/validator";
import type { Cost, Currency } from "./types";
import type { UnionToTuple } from "rilata/core";
import { positiveNumberValidator } from "./base-validators";

const currencies: UnionToTuple<keyof Currency> = ['KZT'];

export const costVmap: ValidatorMap<Cost> = {
  price: positiveNumberValidator,
  currency: new LiteralFieldValidator('currency', true, { isArray: false }, 'string', [
    new StringChoiceValidationRule(currencies)
  ])
}

export const costValidator = new DtoFieldValidator('cost', true, { isArray: false }, 'dto', costVmap);
