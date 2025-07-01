import { userStatisticsVMap } from "#app/domain/contributions/v-map";
import type { EditUserCommand } from "#app/domain/user/struct/edit-user/contract";
import { userVMap } from "#app/domain/user/v-map";
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
