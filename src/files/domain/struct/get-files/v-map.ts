import type { GetFilesCommand } from "#files/domain/struct/get-files/contract";
import { fileEntryAttrsVmap } from "#files/domain/struct/v-map";
import { DtoFieldValidator, type ValidatorMap } from "rilata/validator";

const getFilesVmap: ValidatorMap<GetFilesCommand['attrs']> = {
  ids: fileEntryAttrsVmap.id.cloneWithName('ids').cloneWithIsArray({ isArray: true })
}

export const getFilesValidator = new DtoFieldValidator(
  'get-files', true, { isArray: false }, 'dto', getFilesVmap,
);
