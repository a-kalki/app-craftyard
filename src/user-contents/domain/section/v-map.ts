import {
    DtoFieldValidator, LiteralFieldValidator, MinCharsCountValidationRule, PositiveNumberValidationRule,
    StringChoiceValidationRule, type ValidatorMap,
} from "rilata/validator";
import type { AccessType, ContentSectionAttrs } from "./struct/attrs";
import {
  createAtValidator, shoelaceIconValidator, updateAtValidator, uuidFieldValidator,
} from "#app/domain/base-validators";
import { ownerArAttrsVmap, type UnionToTuple } from "rilata/core";

const accessTypes: UnionToTuple<AccessType> = ['public', 'paid'];

export const contentSectionVmap: ValidatorMap<ContentSectionAttrs> = {
    id: uuidFieldValidator,
    ...ownerArAttrsVmap,
    access: new LiteralFieldValidator('access', true, { isArray: false }, 'string', [
      new StringChoiceValidationRule(accessTypes),
    ]),
    title: new LiteralFieldValidator('title', true, { isArray: false }, 'string', [
        new MinCharsCountValidationRule(5, 'Название должно содержать не менее 5 символов'),
    ]),
    order: new LiteralFieldValidator('order', false, { isArray: false }, 'number', [
        new PositiveNumberValidationRule(),
    ]),
    icon: shoelaceIconValidator.cloneWithRequired(false),
    createAt: createAtValidator,
    updateAt: updateAtValidator,
}

export const contentSectionValidator = new DtoFieldValidator(
  'ThesisSetAr', true, { isArray: false }, 'dto', contentSectionVmap,
)
