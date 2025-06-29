import type { DeleteThesisCommand } from "#user-contents/domain/thesis-set/struct/thesis/delete";
import { thesisVmap, thesisSetAttrsVmap } from "#user-contents/domain/thesis-set/v-map";
import { DtoFieldValidator, type ValidatorMap } from "rilata/validator";

const deleteThesisVmap: ValidatorMap<DeleteThesisCommand['attrs']> = {
  id: thesisSetAttrsVmap.id,
  thesisId: thesisVmap.id.cloneWithName('thesisId'),
}

export const deleteThesisValidator = new DtoFieldValidator(
  'delete-thesis', true, { isArray: false }, 'dto', deleteThesisVmap
)
