import { IsTimeStampValidationRule, LiteralFieldValidator, MinDateStampValidationRule, RegexMatchesValueValidationRule, UuidField } from "rilata/validator";

export const shoelaceIconValidator = new LiteralFieldValidator('icon', true, { isArray: false }, 'string', []);

export const userIdValidator = new LiteralFieldValidator('id', true, { isArray: false }, 'string', [
  new RegexMatchesValueValidationRule(/^\d+$/, 'Id может содержать только цифры'),
])

export const uuidFieldValidator = new UuidField('id');

export const timeStampValidator = new LiteralFieldValidator('createAt', true, { isArray: false }, 'number', [
  new MinDateStampValidationRule(new Date('2025-01-01')),
  new IsTimeStampValidationRule(),
])

export const updateAtValidator = timeStampValidator.cloneWithName('updateAt')

export const notLimitedTimeStampValidator = new LiteralFieldValidator(
  'createAt', true, { isArray: false }, 'number', [ new IsTimeStampValidationRule() ]
)
