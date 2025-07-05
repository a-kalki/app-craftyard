import type { ReorderModelImagesCommand } from "#models/domain/struct/reorder-images/contract";
import { modelAttrsVmap } from "#models/domain/struct/v-map";
import { DtoFieldValidator, type ValidatorMap } from "rilata/validator";

const reorderModelImagesVmap: ValidatorMap<ReorderModelImagesCommand['attrs']> = {
  id: modelAttrsVmap.id,
  reorderedImageIds: modelAttrsVmap.imageIds.cloneWithName('reorderedImageIds'),
}

export const reorderModelImagesValidator = new DtoFieldValidator(
  'reorder-model-images', true, { isArray: false }, 'dto', reorderModelImagesVmap,
);
