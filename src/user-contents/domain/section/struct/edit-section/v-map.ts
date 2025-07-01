import type { EditContentSectionCommand } from "./contract";
import { contentSectionVmap } from "#user-contents/domain/section/v-map";
import { DtoFieldValidator, type ValidatorMap } from "rilata/validator";

export const editContentSectionVmap: ValidatorMap<EditContentSectionCommand['attrs']> = {
  id: contentSectionVmap.id,
  title: contentSectionVmap.title,
  order: contentSectionVmap.order,
  icon: contentSectionVmap.icon,
}

export const editContentSectionValidator = new DtoFieldValidator(
  'edit-content-section', true, { isArray: false }, 'dto', editContentSectionVmap
)
