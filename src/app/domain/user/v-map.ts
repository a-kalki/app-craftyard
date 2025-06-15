import {
  DtoFieldValidator, IsStringTypeRule,
  LiteralFieldValidator,
  MinCharsCountValidationRule,
  RecordDtoValidator,
  RegexMatchesValueValidationRule,
  type ValidatorMap,
} from "rilata/validator";
import { userStatisticsVMap } from "../contributions/v-map";
import type { GetArrayConfig } from "node_modules/rilata/src/domain/validator/field-validator/types";
import type { UserAttrs } from "./struct/attrs";

export function getUserIdValidator<N extends string, REQ extends boolean, IS_ARR extends boolean>(
  name: N, required: REQ, arrayConfig: GetArrayConfig<IS_ARR>
): LiteralFieldValidator<N, REQ, IS_ARR, string> {
  return new LiteralFieldValidator(name, required, arrayConfig, 'string', [
    new RegexMatchesValueValidationRule(/^\d+$/, 'Id может содержать только цифры'),
  ])
}

export const userSupportVMap: ValidatorMap<UserAttrs['support']> = {
  isModerator: new LiteralFieldValidator('isModerator', false, { isArray: false }, 'boolean', [])
}

export const userProfileVMap: ValidatorMap<UserAttrs['profile']> = {
  telegramNickname: new LiteralFieldValidator('telegramNickname', false, { isArray: false }, 'string', []),
  avatarUrl: new LiteralFieldValidator('avatarUrl', false, { isArray: false }, 'string', []),
  // @ts-expect-error
  skills: new RecordDtoValidator(true, { isArray: false }, [
    new IsStringTypeRule(),
    new MinCharsCountValidationRule(30, 'Описание навыка должно содержать не менее 30 символов'),
  ]),
}

export const userVMap: ValidatorMap<UserAttrs> = {
  id: getUserIdValidator('id', true, { isArray: false }),
  name: new LiteralFieldValidator('name', true, { isArray: false }, 'string', [
    new MinCharsCountValidationRule(3, 'Имя должно содержать не менее 3 символов'),
  ]),
  // @ts-expect-error
  support: new DtoFieldValidator('support', false, { isArray: false }, 'dto', userSupportVMap),
  profile: new DtoFieldValidator('profile', true, { isArray: false }, 'dto', userProfileVMap),
  statistics: new DtoFieldValidator('statistics', true, { isArray: false }, 'dto', userStatisticsVMap),
}

export const userInvariantsValidator = new DtoFieldValidator('user', true, { isArray: false }, 'dto', userVMap);
