import type { GetUserContentCommand } from "#user-contents/domain/content/struct/get";
import { userContentVmap } from "#user-contents/domain/content/v-map";
import { DtoFieldValidator, type ValidatorMap } from "rilata/validator";

export const getUserContentVmap: ValidatorMap<GetUserContentCommand['attrs']> = {
  sectionId: userContentVmap.sectionId,
  contentId: userContentVmap.id.cloneWithName('contentId'),
}

export const getUserContentValidator = new DtoFieldValidator(
  'get-user-content', true, { isArray: false }, 'dto', getUserContentVmap
)
