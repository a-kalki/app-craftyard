import {
  DtoFieldValidator, LiteralFieldValidator,
  StringChoiceValidationRule, type ValidatorMap,
}from "rilata/validator";
import type { ModelAttrs } from "./attrs";
import { SKILL_LEVEL_KEYS } from "#app/core/constants";
import { MODEL_CATEGORY_KEYS } from "./constants";
import {
  descriptionValidator, createAtValidator, titleValidator, updateAtValidator,
  userIdValidator, uuidFieldValidator,
} from "#app/core/base-validators";
import { costValidator } from "#app/core/v-map";

export const modelAttrsVmap: ValidatorMap<ModelAttrs> = {
    id: uuidFieldValidator,
    title: titleValidator,
    description: descriptionValidator,
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
    createAt: createAtValidator,
    updateAt: updateAtValidator,
}

export const modelValidator = new DtoFieldValidator('ModelAr', true, { isArray: false }, 'dto', modelAttrsVmap);
