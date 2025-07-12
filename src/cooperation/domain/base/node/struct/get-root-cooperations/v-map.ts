import { DtoFieldValidator, type ValidatorMap } from "rilata/validator";
import type { GetRootCooperationDbosCommand } from "./contract";
import { cooperationNodeVMap } from "../v-map";

const getRootCooperationDbosVmap: ValidatorMap<GetRootCooperationDbosCommand['attrs']> = {
  id: cooperationNodeVMap.id
}

export const getRootCooperationDbosValidator = new DtoFieldValidator(
  'get-root-cooperation-dbos', true, { isArray: false }, 'dto', getRootCooperationDbosVmap
)
