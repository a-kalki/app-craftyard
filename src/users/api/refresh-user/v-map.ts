import type { RefreshUserMeta } from "#app/domain/user/struct/refresh-user";
import { DtoFieldValidator, LiteralFieldValidator, type ValidatorMap } from "rilata/validator";

const refreshUserVmap: ValidatorMap<RefreshUserMeta['in']['attrs']> = {
    refreshToken: new LiteralFieldValidator('refreshToken', true, { isArray: false }, 'string', [])
}

export const refreshUserValidator = new DtoFieldValidator(
  'refresh-user', true, { isArray: false }, 'dto', refreshUserVmap,
)
