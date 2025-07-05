import type { GetContentSectionCommand } from "./contract";
import { contentSectionVmap } from "../v-map";
import { DtoFieldValidator, type ValidatorMap } from "rilata/validator";

const getContentSectionVmap: ValidatorMap<GetContentSectionCommand['attrs']> = {
  id: contentSectionVmap.id
}

export const getContentSectionValidator = new DtoFieldValidator(
  'get-content-section', true, { isArray: false }, 'dto', getContentSectionVmap
)
