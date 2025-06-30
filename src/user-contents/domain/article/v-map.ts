import {
  LiteralFieldValidator, MinCharsCountValidationRule, PositiveNumberValidationRule,
  StrictEqualFieldValidator, type ValidatorMap
} from "rilata/validator";
import type { ArticleAttrs } from "./struct/attrs";
import {
  timeStampValidator, shoelaceIconValidator, updateAtValidator, uuidFieldValidator,
} from "#app/domain/base-validators";
import { ownerArAttrsVmap } from "rilata/core";

const articleType: ArticleAttrs['type'] = 'article';

export const articleAttrsVmap: ValidatorMap<ArticleAttrs> = {
    id: uuidFieldValidator,
    ownerId: ownerArAttrsVmap.ownerId,
    ownerName: ownerArAttrsVmap.ownerName,
    context: ownerArAttrsVmap.context,
    access: ownerArAttrsVmap.access,
    title: new LiteralFieldValidator('title', true, { isArray: false }, 'string', [
        new MinCharsCountValidationRule(5, 'Название должно содержать не менее 5 символов'),
    ]),
    article: new LiteralFieldValidator('article', true, { isArray: false }, 'string', [
        new MinCharsCountValidationRule(50, 'Статья должно содержать не менее 50 символов'),
    ]),
    order: new LiteralFieldValidator('order', false, { isArray: false }, 'number', [
        new PositiveNumberValidationRule(),
    ]),
    icon: shoelaceIconValidator.cloneWithRequired(false),
    type: new StrictEqualFieldValidator('type', articleType),
    createAt: timeStampValidator,
    updateAt: updateAtValidator,
}
