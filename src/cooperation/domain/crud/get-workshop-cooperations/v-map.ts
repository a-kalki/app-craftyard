import { DtoFieldValidator, type ValidatorMap } from "rilata/validator";
import type { GetWorkshopCooperationsCommand } from "./contract";
import { cooperationNodeVMap } from "#cooperation/domain/base/node/struct/v-map";

const getWorkshopCooperationsVmap: ValidatorMap<GetWorkshopCooperationsCommand['attrs']> = {
  workshopId: cooperationNodeVMap.organizationId.cloneWithName('workshopId'),
}

export const getWorkshopCooperationsValidator = new DtoFieldValidator(
  'get-workshop-cooperations', true, { isArray: false }, 'dto', getWorkshopCooperationsVmap
)
