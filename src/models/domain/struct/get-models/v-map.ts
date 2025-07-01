import type { GetModelsCommand } from "#models/domain/struct/get-models/contract";
import { DtoFieldValidator, type ValidatorMap } from "rilata/validator";

const getModelsVmap: ValidatorMap<GetModelsCommand['attrs']> = {}

export const getModelsValidator = new DtoFieldValidator('get-models', true, { isArray: false }, 'dto', getModelsVmap);
