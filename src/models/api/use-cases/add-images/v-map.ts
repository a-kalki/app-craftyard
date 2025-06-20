import type { AddModelImagesCommand } from "#models/domain/struct/add-images";
import { modelVmap } from "#models/domain/v-map";
import { DtoFieldValidator, type ValidatorMap } from "rilata/validator";

const addModelImagesVmap: ValidatorMap<AddModelImagesCommand['attrs']> = {
  id: modelVmap.id,
  pushImageIds: modelVmap.imageIds.cloneWithName('pushImageIds'),
}

export const addModelImagesValidator = new DtoFieldValidator(
  'add-model-images', true, { isArray: false }, 'dto', addModelImagesVmap,
);
