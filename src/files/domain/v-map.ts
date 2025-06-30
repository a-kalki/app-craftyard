import {
  DtoFieldValidator, LiteralFieldValidator, PositiveNumberValidationRule, type ValidatorMap,
} from "rilata/validator";
import type { FileEntryAttrs } from "./struct/attrs";
import { timeStampValidator, uuidFieldValidator } from "#app/domain/base-validators";
import { ownerArAttrsVmap } from "rilata/core";

export const fileEntryAttrsVmap: ValidatorMap<FileEntryAttrs> = {
    id: uuidFieldValidator,
    url: new LiteralFieldValidator('url', true, { isArray: false }, 'string', []),
    mimeType: new LiteralFieldValidator('mimeType', true, { isArray: false }, 'string', []),
    size: new LiteralFieldValidator('size', true, { isArray: false }, 'number', [
        new PositiveNumberValidationRule()
    ]),
    ownerId: ownerArAttrsVmap.ownerId,
    ownerName: ownerArAttrsVmap.ownerName,
    context: ownerArAttrsVmap.context,
    access: ownerArAttrsVmap.access,
    comment: new LiteralFieldValidator('comment', false, { isArray: false }, 'string', []),
    uploadedAt: timeStampValidator.cloneWithName('uploadedAt'),
}

export const fileEntryValidator = new DtoFieldValidator(
  'FileEntryAr', true, { isArray: false }, 'dto', fileEntryAttrsVmap
)
