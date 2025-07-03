import type { UploadFileCommand } from "#files/domain/struct/upload-file/contract";
import { fileEntryAttrsVmap } from "#files/domain/v-map";
import {
  DtoFieldValidator, type ValidatorMap, NotValidateFieldValidator,
  LiteralFieldValidator,
  PositiveNumberValidationRule,
  CannotBeEmptyStringValidationRule,
} from "rilata/validator";

export const uploadFileFileDataVmap: ValidatorMap<UploadFileCommand['attrs']['fileData']> = {
  file: new NotValidateFieldValidator('file'),
  size: new LiteralFieldValidator('size', true, { isArray: false }, 'number', [
    new PositiveNumberValidationRule(),
  ]),
  mimeType: new LiteralFieldValidator('mimeType', true, { isArray: false }, 'string', []),
  name: new LiteralFieldValidator('name', true, { isArray: false }, 'string', [
    new CannotBeEmptyStringValidationRule(),
  ])
}

const uploadFileFileDataValidator = new DtoFieldValidator(
  'fileData', true, { isArray: false }, 'dto', uploadFileFileDataVmap,
);

export const uploadFileEntryDataVmap: ValidatorMap<UploadFileCommand['attrs']['entryData']> = {
  comment: fileEntryAttrsVmap.comment,
  access: fileEntryAttrsVmap.access,
  ownerId: fileEntryAttrsVmap.ownerId,
  ownerName: fileEntryAttrsVmap.ownerName,
  context: fileEntryAttrsVmap.context,
}

const uploadFileEntryDataValidator = new DtoFieldValidator(
  'entryData', true, { isArray: false }, 'dto', uploadFileEntryDataVmap,
);

const uploadFileVmap: ValidatorMap<UploadFileCommand['attrs']> = {
  fileData: uploadFileFileDataValidator,
  entryData: uploadFileEntryDataValidator
}

export const uploadFileValidator = new DtoFieldValidator(
  'upload-file', true, { isArray: false }, 'dto', uploadFileVmap,
);
