import { LiteralFieldValidator, MinCharsCountValidationRule, PositiveNumberValidationRule, StringChoiceValidationRule, type ValidatorMap } from "rilata/validator";
import type { CustomContent } from "./types";

export const customContentTypes: CustomContent['contentType'][] = [
  'text', 'markdown', 'html', 'list', 'contacts',
];

export const customContentVmap: ValidatorMap<CustomContent> = {
  title: new LiteralFieldValidator('title', true, { isArray: false }, 'string', [
    new MinCharsCountValidationRule(5, 'Название содержимого должно содержать не менее 5 символов'),
  ]),
  content: new LiteralFieldValidator('content', true, { isArray: false }, 'string', [
    new MinCharsCountValidationRule(10, 'Содержимое должно содержать не менее 10 символов'),
  ]),
  contentType: new LiteralFieldValidator('contentType', true, { isArray: false }, 'string', [
    new StringChoiceValidationRule(customContentTypes)
  ]),
  order: new LiteralFieldValidator('order', true, { isArray: false }, 'number', [
    new PositiveNumberValidationRule(),
  ]),
  icon: new LiteralFieldValidator('icon', false, { isArray: false }, 'string', []),
};
