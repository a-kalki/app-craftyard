import { DtoFieldValidator, IsTimeStampValidationRule, LiteralFieldValidator, PositiveNumberValidationRule, StringChoiceValidationRule, UuidField, type ValidatorMap } from "rilata/validator";
import type { FileAccessType, FileEntryAttrs } from "./struct/attrs";
import { getUserIdValidator } from "#app/domain/user/v-map";

const fileTypeKeys: FileAccessType['type'][] = ['public', 'private'];

export const fileAccessVmap: ValidatorMap<FileAccessType> = {
  type: new LiteralFieldValidator('type', true, { isArray: false }, 'string', [
    new StringChoiceValidationRule(fileTypeKeys),
  ])
}

export const fileEntryAttrsVmap: ValidatorMap<FileEntryAttrs> = {
  id: new UuidField('id'),
  url: new LiteralFieldValidator('url', true, { isArray: false }, 'string', []),
  mimeType: new LiteralFieldValidator('mimeType', true, { isArray: false }, 'string', []),
  size: new LiteralFieldValidator('size', true, { isArray: false }, 'number', [
    new PositiveNumberValidationRule()
  ]),
  ownerId: getUserIdValidator('ownerId', true, { isArray: false }),
  comment: new LiteralFieldValidator('comment', false, { isArray: false }, 'string', []),
  // @ts-expect-error:
  access: new DtoFieldValidator('access', true, { isArray: false }, 'dto', fileAccessVmap),
  uploadedAt: new LiteralFieldValidator('uploadedAt', true, { isArray: false }, 'number', [
    new IsTimeStampValidationRule(),
  ]),
}

export const fileEntryValidator = new DtoFieldValidator(
  'FileEntryAr', true, { isArray: false }, 'dto', fileEntryAttrsVmap
)
