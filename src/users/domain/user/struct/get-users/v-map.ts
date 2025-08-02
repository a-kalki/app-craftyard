import type { GetUsersCommand } from "#users/domain/user/struct/get-users/contract";
import { DtoFieldValidator, type ValidatorMap } from "rilata/validator";
import { userVMap } from "../v-map";

const getUsersVmap: ValidatorMap<GetUsersCommand['attrs']> = {
  id: userVMap.id.cloneWithRequired(false),
  name: userVMap.name.cloneWithRequired(false),
  support: userVMap.support.cloneWithRequired(false),
  bindWorkshopId: userVMap.bindWorkshopId.cloneWithRequired(false),
  profile: userVMap.profile.cloneWithRequired(false),
  statistics: userVMap.statistics.cloneWithRequired(false),
  createAt: userVMap.createAt.cloneWithRequired(false),
  updateAt: userVMap.updateAt.cloneWithRequired(false)
}

export const getUsersValidator = new DtoFieldValidator(
  'get-users', true, { isArray: false }, 'dto', getUsersVmap,
)
