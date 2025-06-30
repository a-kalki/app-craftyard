import type { EditThesisCommand } from "#user-contents/domain/thesis-set/struct/thesis/edit";
import { thesisVmap, thesisSetAttrsVmap } from "#user-contents/domain/thesis-set/v-map";
import { DtoFieldValidator, type ValidatorMap } from "rilata/validator";

const editThesisVmap: ValidatorMap<EditThesisCommand['attrs']['thesis']> = {
  id: thesisVmap.id,
  title: thesisVmap.title,
  body: thesisVmap.body,
  footer: thesisVmap.footer,
  order: thesisVmap.order,
  icon: thesisVmap.icon
}

const editThesisAttrsVmap: ValidatorMap<EditThesisCommand['attrs']> = {
  id: thesisSetAttrsVmap.id,
  thesis: new DtoFieldValidator('thesis', true, { isArray: false }, 'dto', editThesisVmap),
}

export const editThesisValidator = new DtoFieldValidator(
  'edit-thesis', true, { isArray: false }, 'dto', editThesisAttrsVmap
)
