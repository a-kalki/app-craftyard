import {
  DtoFieldValidator, type ValidatorMap, NotValidateFieldValidator,
  LiteralFieldValidator, StringChoiceValidationRule,
} from "rilata/validator";
import { fileSubDirs } from "src/files/constants";
import type { UploadFileCommand } from "src/files/domain/struct/upload-file";
import { fileAccessVmap, fileEntryAttrsVmap } from "src/files/domain/v-map";

const uploadFileVmap: ValidatorMap<UploadFileCommand['attrs']> = {
    file: new NotValidateFieldValidator('file'),
    comment: fileEntryAttrsVmap.comment,
    // @ts-expect-error
    access: new DtoFieldValidator('access', false, { isArray: false }, 'dto', fileAccessVmap),
    subDir: new LiteralFieldValidator('subDir', false, { isArray: false }, 'string', [
      new StringChoiceValidationRule(fileSubDirs),
    ]),
}

export const uploadFileValidator = new DtoFieldValidator(
  'upload-file', true, { isArray: false }, 'dto', uploadFileVmap,
);
