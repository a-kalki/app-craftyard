import type { GetThesisSetCommand } from "#user-contents/domain/thesis-set/struct/thesis-set/get";
import { thesisSetAttrsVmap } from "#user-contents/domain/thesis-set/v-map";
import { DtoFieldValidator, type ValidatorMap } from "rilata/validator";

const getThesisSetVmap: ValidatorMap<GetThesisSetCommand['attrs']> = {
  id: thesisSetAttrsVmap.id
}

export const getThesisSetValidator = new DtoFieldValidator(
  'get-thesis-set', true, { isArray: false }, 'dto', getThesisSetVmap
)
