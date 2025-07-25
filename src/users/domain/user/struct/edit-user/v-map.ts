import { userStatisticsVMap } from "#users/domain/user-contributions/v-map";
import type { EditUserCommand } from "#users/domain/user/struct/edit-user/contract";
import { userVMap } from "../v-map";
import { DtoFieldValidator, type ValidatorMap } from "rilata/validator";

const editUserVmap: ValidatorMap<EditUserCommand['attrs']> = {
    id: userVMap.id,
    name: userVMap.name,
    profile: userVMap.profile,
    statistics: new DtoFieldValidator('statistics', false, { isArray: false }, 'dto', userStatisticsVMap),
}

export const editUserValidator = new DtoFieldValidator(
  'edit-user', true, { isArray: false }, 'dto', editUserVmap,
)
