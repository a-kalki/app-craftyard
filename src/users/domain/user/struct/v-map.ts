import {
    BooleanFieldValidator,
  DtoFieldValidator, IsStringTypeRule,
  MinCharsCountValidationRule,
  RecordDtoValidator,
  RegexMatchesValueValidationRule,
  StringFieldValidator,
  type ValidationMap,
} from "rilata/validator";
import type { UserAttrs } from "./meta";

export const userSupportVMap: ValidationMap<UserAttrs['support']> = {
  isModerator: new BooleanFieldValidator('isModerator', false, { isArray: false }, [])
}

export const UserSkillsVMap: ValidationMap<UserAttrs['profile']['skills']> = {
  skills: new RecordDtoValidator(true, { isArray: false }, [
    new IsStringTypeRule(),
    new MinCharsCountValidationRule(30, 'Описание навыка должно содержать не менее 30 символов'),
])
}

export const UserProfileVMap: ValidationMap<UserAttrs['profile']> = {
  telegramNickname: new StringFieldValidator('telegramNickname', false, { isArray: false }, []),
  avatarUrl: new StringFieldValidator('avatarUrl', false, { isArray: false }, []),
  skills: UserSkillsVMap,
}

// const a: UserAttrs = {
//   id: '1',
//   name: 'test',
//   support: {
//     isModerator: true
//   },
//   profile: {
//     telegramNickname: 'test',
//     avatarUrl: 'test',
//     skills: {
//       skills: 'test',
//     }
//   },
//   statistics: {
//     contributions: {}
//   }
// }

export const userVMap: ValidationMap<UserAttrs> = {
  id: new StringFieldValidator('id', true, { isArray: false }, [
    new RegexMatchesValueValidationRule(/^\d+$/, 'Id может содержать только цифры'),
  ]),
  name: new StringFieldValidator('name', true, { isArray: false }, [
    new MinCharsCountValidationRule(3, 'Имя должно содержать не менее 3 символов'),
  ]),
  support: new DtoFieldValidator('support', false, { isArray: false }, userSupportVMap),
  profile: undefined,
  statistics: undefined
}
