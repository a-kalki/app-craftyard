import {
    DtoFieldValidator, LiteralFieldValidator, MinCharsCountValidationRule, PositiveNumberValidationRule,
    StrictEqualFieldValidator, type ValidatorMap,
} from "rilata/validator";
import type { Thesis, ThesisSetAttrs } from "./struct/attrs";
import {
  timeStampValidator, shoelaceIconValidator, updateAtValidator, uuidFieldValidator,
} from "#app/domain/base-validators";
import { articleAttrsVmap } from "../article/v-map";

export const thesisVmap: ValidatorMap<Thesis> = {
    id: uuidFieldValidator,
    title: new LiteralFieldValidator('title', true, { isArray: false }, 'string', [
        new MinCharsCountValidationRule(5, 'Название должно содержать не менее 5 символов'),
    ]),
    body: new LiteralFieldValidator('body', true, { isArray: false }, 'string', [
        new MinCharsCountValidationRule(10, 'Тезис должен содержать не менее 10 символов'),
    ]),
    footer: new LiteralFieldValidator('footer', false, { isArray: false }, 'string', [
        new MinCharsCountValidationRule(10, 'Футер должен содержать не менее 10 символов'),
    ]),
    order: new LiteralFieldValidator('order', false, { isArray: false }, 'number', [
        new PositiveNumberValidationRule(),
    ]),
    icon: shoelaceIconValidator.cloneWithRequired(false),
    createAt: timeStampValidator,
    updateAt: updateAtValidator,
}

const thesisAttrsValidator = new DtoFieldValidator('theses', true, { isArray: true }, 'dto', thesisVmap);

const thesisSetType: ThesisSetAttrs['type'] = 'thesis-set';

export const thesisSetAttrsVmap: ValidatorMap<ThesisSetAttrs> = {
    id: articleAttrsVmap.id,
    ownerId: articleAttrsVmap.ownerId,
    ownerName: articleAttrsVmap.ownerName,
    context: articleAttrsVmap.context,
    title: articleAttrsVmap.title,
    access: articleAttrsVmap.access,
    theses: thesisAttrsValidator,
    order: articleAttrsVmap.order,
    icon: articleAttrsVmap.icon,
    type: new StrictEqualFieldValidator('type', thesisSetType),
    createAt: timeStampValidator,
    updateAt: updateAtValidator,
}

export const thesisSetValidator = new DtoFieldValidator(
  'ThesisSetAr', true, { isArray: false }, 'dto', thesisSetAttrsVmap,
)
