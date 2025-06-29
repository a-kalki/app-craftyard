import type { AddThesisSetCommand } from "#user-contents/domain/thesis-set/struct/thesis-set/add";
import { thesisSetAttrsVmap } from "#user-contents/domain/thesis-set/v-map";
import { DtoFieldValidator, type ValidatorMap } from "rilata/validator";

export const addThesisSetVmap: ValidatorMap<AddThesisSetCommand['attrs']> = {
    ownerId: thesisSetAttrsVmap.ownerId,
    ownerName: thesisSetAttrsVmap.ownerName,
    context: thesisSetAttrsVmap.context,
    access: thesisSetAttrsVmap.access,
    title: thesisSetAttrsVmap.title,
    order: thesisSetAttrsVmap.order,
    icon: thesisSetAttrsVmap.icon,
}

export const addThesisSetValidator = new DtoFieldValidator(
  'add-thesis-set', true, { isArray: false }, 'dto', addThesisSetVmap
)
