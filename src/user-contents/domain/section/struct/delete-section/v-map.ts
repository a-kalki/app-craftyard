import type { DeleteContentSectionCommand } from "./contract";
import { contentSectionVmap } from "../v-map";
import { DtoFieldValidator, type ValidatorMap } from "rilata/validator";

const deleteContentSectionVmap: ValidatorMap<DeleteContentSectionCommand['attrs']> = {
  id: contentSectionVmap.id
}

export const deleteContentSectionValidator = new DtoFieldValidator(
  'delete-content-section', true, { isArray: false }, 'dto', deleteContentSectionVmap
)
