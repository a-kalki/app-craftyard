import { DtoFieldValidator, type ValidatorMap } from "rilata/validator";
import type { GetRootCooperationsCommand } from "./contract";
import { cooperationNodeVMap } from "#cooperation/domain/base/node/struct/v-map";

const getRootCooperationsVmap: ValidatorMap<GetRootCooperationsCommand['attrs']> = {
  rootId: cooperationNodeVMap.id.cloneWithName('rootId'),
}

export const getRootCooperationsValidator = new DtoFieldValidator(
  'get-root-cooperations', true, { isArray: false }, 'dto', getRootCooperationsVmap
)
