import type { EditModelCommand } from "#models/domain/struct/edit-model/contract";
import { modelAttrsVmap } from "#models/domain/v-map";
import { DtoFieldValidator, type ValidatorMap } from "rilata/validator";

export const editModelVmap: ValidatorMap<EditModelCommand['attrs']> = {
    id: modelAttrsVmap.id,
    title: modelAttrsVmap.title,
    description: modelAttrsVmap.description,
    categories: modelAttrsVmap.categories,
    difficultyLevel: modelAttrsVmap.difficultyLevel,
    estimatedTime: modelAttrsVmap.estimatedTime,
    cost: modelAttrsVmap.cost,
}

export const editModelValidator = new DtoFieldValidator(
  'edit-model', true, { isArray: false }, 'dto', editModelVmap,
);
