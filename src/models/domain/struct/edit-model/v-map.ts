import type { EditModelCommand } from "#models/domain/struct/edit-model/contract";
import { modelVmap } from "#models/domain/v-map";
import { DtoFieldValidator, type ValidatorMap } from "rilata/validator";

export const editModelVmap: ValidatorMap<EditModelCommand['attrs']> = {
    id: modelVmap.id,
    title: modelVmap.title,
    description: modelVmap.description,
    categories: modelVmap.categories,
    difficultyLevel: modelVmap.difficultyLevel,
    estimatedTime: modelVmap.estimatedTime,
    cost: modelVmap.cost,
}

export const editModelValidator = new DtoFieldValidator(
  'edit-model', true, { isArray: false }, 'dto', editModelVmap,
);
