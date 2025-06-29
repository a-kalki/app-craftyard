import {
  DtoFieldValidator, LiteralFieldValidator, PositiveNumberValidationRule,
  StringChoiceValidationRule, type ValidatorMap,
} from "rilata/validator";
import type { FileEntryAttrs } from "./struct/attrs";
import { timeStampValidator, uuidFieldValidator } from "../base-validators";

const fileAccess: FileEntryAttrs['access'][] = ['public', 'private'];

export const fileEntryAttrsVmap: ValidatorMap<FileEntryAttrs> = {
  id: uuidFieldValidator,
  url: new LiteralFieldValidator('url', true, { isArray: false }, 'string', []),
  mimeType: new LiteralFieldValidator('mimeType', true, { isArray: false }, 'string', []),
  size: new LiteralFieldValidator('size', true, { isArray: false }, 'number', [
    new PositiveNumberValidationRule()
  ]),
  ownerId: new LiteralFieldValidator('ownerId', true, { isArray: false }, 'string', []),
  comment: new LiteralFieldValidator('comment', false, { isArray: false }, 'string', []),
  access: new LiteralFieldValidator('access', true, { isArray: false }, 'string', [
    new StringChoiceValidationRule(fileAccess)
  ]),
  uploadedAt: timeStampValidator.cloneWithName('uploadedAt'),
}

export const fileEntryValidator = new DtoFieldValidator(
  'FileEntryAr', true, { isArray: false }, 'dto', fileEntryAttrsVmap
)
