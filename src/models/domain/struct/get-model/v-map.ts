import type { GetModelCommand } from "#models/domain/struct/get-model/contract";
import { modelAttrsVmap } from "#models/domain/struct/v-map";
import { DtoFieldValidator, type ValidatorMap } from "rilata/validator";

const getModelVmap: ValidatorMap<GetModelCommand['attrs']> = {
  id: modelAttrsVmap.id,
}

export const getModelValidator = new DtoFieldValidator(
  'get-model', true, { isArray: false }, 'dto', getModelVmap,
);
