import type { AddThesisCommand } from "#user-contents/domain/thesis-set/struct/thesis/add";
import { thesisSetAttrsVmap, thesisVmap } from "#user-contents/domain/thesis-set/v-map";
import { DtoFieldValidator, type ValidatorMap } from "rilata/validator";

export const addThesisVmap: ValidatorMap<AddThesisCommand['attrs']['newThesisAttrs']> = {
  title: thesisVmap.title,
  body: thesisVmap.body,
  footer: thesisVmap.footer,
  order: thesisVmap.order,
  icon: thesisVmap.icon
}

const addThesisAttrsVmap: ValidatorMap<AddThesisCommand['attrs']> = {
  id: thesisSetAttrsVmap.id,
  newThesisAttrs: new DtoFieldValidator('newThesisAttrs', true, { isArray: false }, 'dto', addThesisVmap),
}

export const addThesisValidator = new DtoFieldValidator(
  'add-thesis', true, { isArray: false }, 'dto', addThesisAttrsVmap
)
