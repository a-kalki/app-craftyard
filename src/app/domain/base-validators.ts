/** модуль содержит валидаторы которые могут повторно переиспользоваться в разных агрегатах. */
import { CannotBeEmptyStringValidationRule, IsTimeStampValidationRule, LiteralFieldValidator, MinCharsCountValidationRule, MinDateStampValidationRule, PositiveNumberValidationRule, RegexMatchesValueValidationRule, UuidField, UUIDFormatValidationRule } from "rilata/validator";

// *********************** rules ***************************
export const cannotBeEmptyRule = new CannotBeEmptyStringValidationRule();

export const positiveNumberRule = new PositiveNumberValidationRule();

export const onlyDigitsRule = new RegexMatchesValueValidationRule(/^\d+$/, 'Строка должна содержать только цифры');

export const uuidRule = new UUIDFormatValidationRule();

// *********************** validators ***************************
export const shoelaceIconValidator = new LiteralFieldValidator('icon', true, { isArray: false }, 'string', []);

export const userIdValidator = new LiteralFieldValidator('id', true, { isArray: false }, 'string', [
  onlyDigitsRule
]);

export const ownerIdValidator = new LiteralFieldValidator('ownerId', true, { isArray: false }, 'string', [
  cannotBeEmptyRule
]);

export const uuidFieldValidator = new UuidField('id');

export const titleValidator = new LiteralFieldValidator('title', true, { isArray: false }, 'string', [
    new MinCharsCountValidationRule(5, 'Название должно содержать не менее 5 символов'),
]);

export const descriptionValidator =  new LiteralFieldValidator('description', true, { isArray: false }, 'string', [
    new MinCharsCountValidationRule(10, 'Описание должно содержать не менее 10 символов'),
]);

export const createAtValidator = new LiteralFieldValidator('createAt', true, { isArray: false }, 'number', [
  new MinDateStampValidationRule(new Date('2025-01-01')),
  new IsTimeStampValidationRule(),
])

export const updateAtValidator = createAtValidator.cloneWithName('updateAt')

export const notLimitedTimeStampValidator = new LiteralFieldValidator(
  'createAt', true, { isArray: false }, 'number', [ new IsTimeStampValidationRule() ]
)

export const editorIdsValidator = new LiteralFieldValidator('editorIds', true, { isArray: true, minElementsCount: 1 }, 'string', [
  onlyDigitsRule,
])

export const positiveNumberValidator = new LiteralFieldValidator('price', true, { isArray: false }, 'number', [
  positiveNumberRule
]);
