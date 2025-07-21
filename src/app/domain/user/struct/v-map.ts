import {
  DtoFieldValidator,
  LiteralFieldValidator,
  MinCharsCountValidationRule,
  type ValidatorMap,
} from "rilata/validator";
import { userStatisticsVMap } from "../../user-contributions/v-map";
import type { UserAttrs } from "../struct/attrs";
import { createAtValidator, updateAtValidator, userIdValidator, uuidFieldValidator } from "../../base-validators";

export const userSupportVMap: ValidatorMap<UserAttrs['support']> = {
  isModerator: new LiteralFieldValidator('isModerator', false, { isArray: false }, 'boolean', [])
}

export const userProfileVMap: ValidatorMap<UserAttrs['profile']> = {
  telegramNickname: new LiteralFieldValidator('telegramNickname', false, { isArray: false }, 'string', []),
  avatarUrl: new LiteralFieldValidator('avatarUrl', false, { isArray: false }, 'string', []),
  skillsContentSectionId: uuidFieldValidator.cloneWithName('skillsContentSectionId'),
}

export const userVMap: ValidatorMap<UserAttrs> = {
  id: userIdValidator,
  name: new LiteralFieldValidator('name', true, { isArray: false }, 'string', [
      new MinCharsCountValidationRule(3, 'Имя должно содержать не менее 3 символов'),
  ]),
  bindWorkshopId: uuidFieldValidator.cloneWithName('bindWorkshopId').cloneWithRequired(false),
  support: new DtoFieldValidator('support', false, { isArray: false }, 'dto', userSupportVMap),
  profile: new DtoFieldValidator('profile', true, { isArray: false }, 'dto', userProfileVMap),
  statistics: new DtoFieldValidator('statistics', true, { isArray: false }, 'dto', userStatisticsVMap),
  createAt: createAtValidator,
  updateAt: updateAtValidator,
}

export const userInvariantsValidator = new DtoFieldValidator('user', true, { isArray: false }, 'dto', userVMap);
