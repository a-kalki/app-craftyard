import type { DeleteContentSectionCommand } from "#user-contents/domain/section/struct/delete";
import { contentSectionVmap } from "#user-contents/domain/section/v-map";
import { DtoFieldValidator, type ValidatorMap } from "rilata/validator";

const deleteContentSectionVmap: ValidatorMap<DeleteContentSectionCommand['attrs']> = {
  id: contentSectionVmap.id
}

export const deleteContentSectionValidator = new DtoFieldValidator(
  'delete-content-section', true, { isArray: false }, 'dto', deleteContentSectionVmap
)
