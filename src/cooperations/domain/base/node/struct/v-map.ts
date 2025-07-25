import { LiteralFieldValidator, StringChoiceValidationRule, type ValidatorMap } from "rilata/validator";
import type { CooperationContextType, CooperationNodeAttrs } from "./attrs";
import { cannotBeEmptyRule, titleValidator, uuidFieldValidator, uuidRule } from "#app/core/base-validators";
import type { UnionToTuple } from "rilata/core";

export const cooperationContextTypes: UnionToTuple<CooperationContextType> = [
  'RENT', 'PRODUCT_SALE', 'COURSE', 'HOBBY_KIT',
]

export const cooperationNodeVMap: ValidatorMap<CooperationNodeAttrs> = {
  id: uuidFieldValidator,
  title: titleValidator,
  responsibilities: new LiteralFieldValidator(
    'responsibilities', true, { isArray: true }, 'string', [cannotBeEmptyRule]
  ),
  type: new LiteralFieldValidator('type', true, { isArray: false }, 'string', []),
  contextType: new LiteralFieldValidator(
    'contextType', true, { isArray: true, minElementsCount: 1 }, 'string', [
      new StringChoiceValidationRule(cooperationContextTypes),
    ]
  ),
  organizationId: new LiteralFieldValidator(
    'organizationId', true, { isArray: false }, 'string', [uuidRule]
  )
}
