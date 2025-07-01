import {
  DtoFieldValidator, LiteralFieldValidator, MinCharsCountValidationRule,
  StringChoiceValidationRule, type ValidatorMap,
}from "rilata/validator";
import type { ModelAttrs } from "./struct/attrs";
import { SKILL_LEVEL_KEYS } from "#app/domain/constants";
import { MODEL_CATEGORY_KEYS } from "./struct/constants";
import { timeStampValidator, updateAtValidator, userIdValidator, uuidFieldValidator } from "#app/domain/base-validators";
import { costValidator } from "#app/domain/v-map";

export const modelVmap: ValidatorMap<ModelAttrs> = {
    id: uuidFieldValidator,
    title: new LiteralFieldValidator('title', true, { isArray: false }, 'string', [
        new MinCharsCountValidationRule(5, 'Название должно содержать не менее 5 символов'),
    ]),
    description: new LiteralFieldValidator('description', true, { isArray: false }, 'string', [
        new MinCharsCountValidationRule(10, 'Описание должно содержать не менее 10 символов'),
    ]),
    ownerId: userIdValidator.cloneWithName('ownerId'),
    imageIds: new LiteralFieldValidator('imageIds', true, { isArray: true }, 'string', []),
    categories: new LiteralFieldValidator('categories', true, { isArray: true }, 'string', [
        new StringChoiceValidationRule(MODEL_CATEGORY_KEYS)
    ]),
    difficultyLevel: new LiteralFieldValidator('difficultyLevel', true, { isArray: false }, 'string', [
        new StringChoiceValidationRule(SKILL_LEVEL_KEYS)
    ]),
    estimatedTime: new LiteralFieldValidator('estimatedTime', true, { isArray: false }, 'string', []),
    cost: costValidator,
    createAt: timeStampValidator,
    updateAt: updateAtValidator,
}

export const modelValidator = new DtoFieldValidator('ModelAr', true, { isArray: false }, 'dto', modelVmap);
