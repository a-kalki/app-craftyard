import type { DeleteUserContentCommand } from "#user-contents/domain/content/struct/delete";
import { userContentVmap } from "#user-contents/domain/content/v-map";
import { DtoFieldValidator, type ValidatorMap } from "rilata/validator";

const deleteUserContentVmap: ValidatorMap<DeleteUserContentCommand['attrs']> = {
  sectionId: userContentVmap.sectionId,
  contentId: userContentVmap.id.cloneWithName('contentId'),
}

export const deleteUserContentValidator = new DtoFieldValidator(
  'delete-user-content', true, { isArray: false }, 'dto', deleteUserContentVmap
)
