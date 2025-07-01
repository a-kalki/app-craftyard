import type { GetModelCommand } from "#models/domain/struct/get-model/contract";
import { modelVmap } from "#models/domain/v-map";
import { DtoFieldValidator, type ValidatorMap } from "rilata/validator";

const getModelVmap: ValidatorMap<GetModelCommand['attrs']> = {
  id: modelVmap.id,
}

export const getModelValidator = new DtoFieldValidator(
  'get-model', true, { isArray: false }, 'dto', getModelVmap,
);
