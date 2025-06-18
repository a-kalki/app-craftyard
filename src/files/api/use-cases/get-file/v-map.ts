import { DtoFieldValidator, type ValidatorMap } from "rilata/validator";
import type { GetFileCommand } from "src/files/domain/struct/get-file";
import { fileEntryAttrsVmap } from "src/files/domain/v-map";

const getFileVmap: ValidatorMap<GetFileCommand['attrs']> = {
  id: fileEntryAttrsVmap.id
}

export const getFileValidator = new DtoFieldValidator(
  'get-file', true, { isArray: false }, 'dto', getFileVmap,
);
