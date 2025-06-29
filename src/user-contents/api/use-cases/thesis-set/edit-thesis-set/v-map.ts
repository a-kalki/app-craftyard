import type { EditThesisSetCommand } from "#user-contents/domain/thesis-set/struct/thesis-set/edit";
import { thesisSetAttrsVmap } from "#user-contents/domain/thesis-set/v-map";
import { DtoFieldValidator, type ValidatorMap } from "rilata/validator";

const editThesisSetVmap: ValidatorMap<EditThesisSetCommand['attrs']> = {
  id: thesisSetAttrsVmap.id,
  title: thesisSetAttrsVmap.title,
  order: thesisSetAttrsVmap.order,
  icon: thesisSetAttrsVmap.icon,
}

export const editThesisSetValidator = new DtoFieldValidator(
  'edit-thesis-set', true, { isArray: false }, 'dto', editThesisSetVmap
)
