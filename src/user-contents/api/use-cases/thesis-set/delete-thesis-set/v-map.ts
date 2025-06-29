import type { DeleteThesisSetCommand } from "#user-contents/domain/thesis-set/struct/thesis-set/delete";
import { thesisSetAttrsVmap } from "#user-contents/domain/thesis-set/v-map";
import { DtoFieldValidator, type ValidatorMap } from "rilata/validator";

const deleteThesisSetVmap: ValidatorMap<DeleteThesisSetCommand['attrs']> = {
  id: thesisSetAttrsVmap.id
}

export const deleteThesisSetValidator = new DtoFieldValidator(
  'delete-thesis-set', true, { isArray: false }, 'dto', deleteThesisSetVmap
)
