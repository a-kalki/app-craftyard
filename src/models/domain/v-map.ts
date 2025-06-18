import { DtoFieldValidator, LiteralFieldValidator, MinCharsCountValidationRule, PositiveNumberValidationRule, StringChoiceValidationRule, UuidField, type ValidatorMap } from "rilata/validator";
import type { ModelAttrs } from "./struct/attrs";
import { getUserIdValidator } from "#app/domain/user/v-map";
import { skillLevelKeys } from "#app/domain/constants";
import { modelCategoryKeys } from "./struct/constants";

export const modelVmap: ValidatorMap<ModelAttrs> = {
  id: new UuidField('id'),
  title: new LiteralFieldValidator('title', true, { isArray: false }, 'string', [
    new MinCharsCountValidationRule(5, 'Название должно содержать не менее 5 символов'),
  ]),
  description: new LiteralFieldValidator('description', true, { isArray: false }, 'string', [
    new MinCharsCountValidationRule(10, 'Описание должно содержать не менее 10 символов'),
  ]),
  owner: getUserIdValidator('owner', true, { isArray: false }),
  imageIds: new LiteralFieldValidator('imageIds', true, { isArray: true }, 'string', []),
  categories: new LiteralFieldValidator('categories', true, { isArray: true }, 'string', [
    new StringChoiceValidationRule(modelCategoryKeys)
  ]),
  difficultyLevel: new LiteralFieldValidator('difficultyLevel', true, { isArray: false }, 'string', [
    new StringChoiceValidationRule(skillLevelKeys)
  ]),
  materialsList: new LiteralFieldValidator('materialsList', true, { isArray: true }, 'string', []),
  toolsRequired: new LiteralFieldValidator('toolsRequired', true, { isArray: true }, 'string', []),
  estimatedTime: new LiteralFieldValidator('estimatedTime', true, { isArray: false }, 'string', []),
  pricePerAccess: new LiteralFieldValidator('pricePerAccess', true, { isArray: false }, 'number', [
    new PositiveNumberValidationRule(),
  ])
}

export const modelValidator = new DtoFieldValidator('ModelAr', true, { isArray: false }, 'dto', modelVmap);
