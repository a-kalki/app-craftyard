import type { AuthUserMeta } from "#app/domain/user/struct/auth-user";
import { DtoFieldValidator, LiteralFieldValidator, StringChoiceValidationRule, type ValidatorMap } from "rilata/validator";

const choiceValues: Array<AuthUserMeta['in']['attrs']['type']> = ['widget-login', 'mini-app-login'];

const authUserVmap: ValidatorMap<AuthUserMeta['in']['attrs']> = {
    type: new LiteralFieldValidator('type', true, { isArray: false }, 'string', [
        new StringChoiceValidationRule(choiceValues),
    ]),
    data: new LiteralFieldValidator('data', true, { isArray: false }, 'string', []),
}

export const authUserValidator = new DtoFieldValidator(
  'auth-user', true, { isArray: false }, 'dto', authUserVmap,
)
