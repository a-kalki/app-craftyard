import type { GetFileCommand } from "#files/domain/struct/get-file";
import { fileEntryAttrsVmap } from "#files/domain/v-map";
import { DtoFieldValidator, type ValidatorMap } from "rilata/validator";

const getFileVmap: ValidatorMap<GetFileCommand['attrs']> = {
  id: fileEntryAttrsVmap.id
}

export const getFileValidator = new DtoFieldValidator(
  'get-file', true, { isArray: false }, 'dto', getFileVmap,
);
