import { DtoFieldValidator, LiteralFieldValidator, TextStrictEqualValidationRule, type ValidatorMap } from "rilata/validator";
import type { OfferCooperationAttrs } from "./attrs";
import { childableAttrsVmap } from "#cooperation/domain/base/childable/struct/v-map";
import { editorIdsValidator, uuidFieldValidator } from "#app/domain/base-validators";

export const offerCooperationContributionType: OfferCooperationAttrs['type'] =
  'OFFER_COOPERATION';

export const offerCooperationContributionVmap: ValidatorMap<OfferCooperationAttrs> = {
  id: childableAttrsVmap.id,
  title: childableAttrsVmap.title,
  responsibilities: childableAttrsVmap.responsibilities,
  childrenIds: childableAttrsVmap.childrenIds,
  fatherId: uuidFieldValidator.cloneWithName('fatherId'),
  editorIds: editorIdsValidator,
  organizationId: childableAttrsVmap.organizationId,
  type: new LiteralFieldValidator(
    'type', true, { isArray: false }, 'string', [
      new TextStrictEqualValidationRule(offerCooperationContributionType)
    ]
  ),
  contextType: childableAttrsVmap.contextType,
}

export const offerCooperationContributionValidator = new DtoFieldValidator(
  'OfferCooperationContributionAr', true, { isArray: false }, 'dto', offerCooperationContributionVmap
)
