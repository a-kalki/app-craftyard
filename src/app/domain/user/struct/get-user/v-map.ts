import type { GetUserCommand } from "#app/domain/user/struct/get-user/contract";
import { DtoFieldValidator, type ValidatorMap } from "rilata/validator";
import { userVMap } from "../v-map";

const getUserVmap: ValidatorMap<GetUserCommand['attrs']> = {
    id: userVMap.id,
}

export const getUserValidator = new DtoFieldValidator(
  'get-user', true, { isArray: false }, 'dto', getUserVmap,
)
