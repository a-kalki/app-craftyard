import { DtoFieldValidator, type ValidatorMap } from "rilata/validator";
import type { GetCooperationCommand } from "./contract";
import { cooperationNodeVMap } from "#cooperations/domain/base/node/struct/v-map";

const getCooperationVmap: ValidatorMap<GetCooperationCommand['attrs']> = {
  id: cooperationNodeVMap.id
}

export const getCooperationValidator = new DtoFieldValidator(
  'get-cooperation', true, { isArray: false }, 'dto', getCooperationVmap
)
