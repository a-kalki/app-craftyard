import { DtoFieldValidator, LiteralFieldValidator, PositiveNumberValidationRule, StringChoiceValidationRule, type ValidatorMap } from "rilata/validator";
import type { Cost, Currency } from "./types";
import type { UnionToTuple } from "rilata/core";

const currencies: UnionToTuple<keyof Currency> = ['KZT'];

export const costVmap: ValidatorMap<Cost> = {
  price: new LiteralFieldValidator('price', true, { isArray: false }, 'number', [
    new PositiveNumberValidationRule(),
  ]),
  currency: new LiteralFieldValidator('currency', true, { isArray: false }, 'string', [
    new StringChoiceValidationRule(currencies)
  ])
}

export const costValidator = new DtoFieldValidator('cost', true, { isArray: false }, 'dto', costVmap);
