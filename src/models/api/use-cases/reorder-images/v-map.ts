import type { ReorderModelImagesCommand } from "#models/domain/struct/reorder-images";
import { modelVmap } from "#models/domain/v-map";
import { DtoFieldValidator, type ValidatorMap } from "rilata/validator";

const reorderModelImagesVmap: ValidatorMap<ReorderModelImagesCommand['attrs']> = {
  id: modelVmap.id,
  reorderedImageIds: modelVmap.imageIds.cloneWithName('reorderedImageIds'),
}

export const reorderModelImagesValidator = new DtoFieldValidator(
  'reorder-model-images', true, { isArray: false }, 'dto', reorderModelImagesVmap,
);
