import type { GetSectionContentsCommand } from "#user-contents/domain/content/struct/get-section-contents";
import { userContentVmap } from "#user-contents/domain/content/v-map";
import { DtoFieldValidator, type ValidatorMap } from "rilata/validator";

export const getSectionContentsVmap: ValidatorMap<GetSectionContentsCommand['attrs']> = {
  sectionId: userContentVmap.sectionId
}

export const getSectionContentsValidator = new DtoFieldValidator(
  'get-section-user-contents', true, { isArray: false }, 'dto', getSectionContentsVmap
)
