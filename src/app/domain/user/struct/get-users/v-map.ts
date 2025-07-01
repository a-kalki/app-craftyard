import type { GetUsersCommand } from "#app/domain/user/struct/get-users/contract";
import { DtoFieldValidator, type ValidatorMap } from "rilata/validator";

const getUsersVmap: ValidatorMap<GetUsersCommand['attrs']> = {}

export const getUsersValidator = new DtoFieldValidator(
  'get-users', true, { isArray: false }, 'dto', getUsersVmap,
)
