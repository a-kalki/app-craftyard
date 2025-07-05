import type { AddModelImagesCommand } from "#models/domain/struct/add-images/contract";
import { modelAttrsVmap } from "#models/domain/struct/v-map";
import { DtoFieldValidator, type ValidatorMap } from "rilata/validator";

const addModelImagesVmap: ValidatorMap<AddModelImagesCommand['attrs']> = {
  id: modelAttrsVmap.id,
  pushImageIds: modelAttrsVmap.imageIds.cloneWithName('pushImageIds'),
}

export const addModelImagesValidator = new DtoFieldValidator(
  'add-model-images', true, { isArray: false }, 'dto', addModelImagesVmap,
);
