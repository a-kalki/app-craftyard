import { DtoFieldValidator, type ValidatorMap } from "rilata/validator";
import type { AddContentSectionCommand } from "./contract";
import { contentSectionVmap } from "../v-map";

export const addContentSectionVmap: ValidatorMap<AddContentSectionCommand['attrs']> = {
  ownerId: contentSectionVmap.ownerId,
  ownerName: contentSectionVmap.ownerName,
  context: contentSectionVmap.context,
  access: contentSectionVmap.access,
  title: contentSectionVmap.title,
  order: contentSectionVmap.order,
  icon: contentSectionVmap.icon,
}

export const addContentSectionValidator = new DtoFieldValidator(
  'add-content-section', true, { isArray: false }, 'dto', addContentSectionVmap
)
