import type { AddModelCommand } from "#models/domain/struct/add-model/contract";
import { modelAttrsVmap } from "#models/domain/struct/v-map";
import { DtoFieldValidator, type ValidatorMap } from "rilata/validator";

export const addModelVmap: ValidatorMap<AddModelCommand['attrs']> = {
  title: modelAttrsVmap.title,
  description: modelAttrsVmap.description,
  categories: modelAttrsVmap.categories,
  difficultyLevel: modelAttrsVmap.difficultyLevel,
  estimatedTime: modelAttrsVmap.estimatedTime,
  cost: modelAttrsVmap.cost,
}

export const addModelValidator = new DtoFieldValidator(
  'add-model', true, { isArray: false }, 'dto', addModelVmap,
);
