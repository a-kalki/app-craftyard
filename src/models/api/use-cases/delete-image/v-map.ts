import type { DeleteModelImageCommand } from "#models/domain/struct/delete-image";
import { modelVmap } from "#models/domain/v-map";
import { DtoFieldValidator, LiteralFieldValidator, type ValidatorMap } from "rilata/validator";

const deleteModelImageVmap: ValidatorMap<DeleteModelImageCommand['attrs']> = {
  id: modelVmap.id,
  imageId: new LiteralFieldValidator('imageId', true, { isArray: false }, 'string', []),
}

export const deleteModelImageValidator = new DtoFieldValidator(
  'delete-model-image', true, { isArray: false }, 'dto', deleteModelImageVmap,
);
