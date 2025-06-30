import type { UploadFileCommand } from "#files/domain/struct/upload-file";
import { fileEntryAttrsVmap } from "#files/domain/v-map";
import {
  DtoFieldValidator, type ValidatorMap, NotValidateFieldValidator,
} from "rilata/validator";

const uploadFileVmap: ValidatorMap<UploadFileCommand['attrs']> = {
    file: new NotValidateFieldValidator('file'),
    comment: fileEntryAttrsVmap.comment,
    access: fileEntryAttrsVmap.access,
    ownerId: fileEntryAttrsVmap.ownerId,
    ownerName: fileEntryAttrsVmap.ownerName,
    context: fileEntryAttrsVmap.context,
}

export const uploadFileValidator = new DtoFieldValidator(
  'upload-file', true, { isArray: false }, 'dto', uploadFileVmap,
);
