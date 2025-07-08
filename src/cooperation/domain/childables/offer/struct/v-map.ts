import { DtoFieldValidator, LiteralFieldValidator, TextStrictEqualValidationRule, type ValidatorMap } from "rilata/validator";
import type { OfferCooperationAttrs } from "./attrs";
import { cooperationAttrsVmap } from "#cooperation/domain/base/childable/struct/v-map";
import { uuidFieldValidator } from "#app/domain/base-validators";

export const offerCooperationContributionType: OfferCooperationAttrs['type'] =
  'OFFER_COOPERATION';

export const offerCooperationContributionVmap: ValidatorMap<OfferCooperationAttrs> = {
  id: cooperationAttrsVmap.id,
  title: cooperationAttrsVmap.title,
  responsibilities: cooperationAttrsVmap.responsibilities,
  childrenIds: cooperationAttrsVmap.childrenIds,
  fatherId: uuidFieldValidator.cloneWithName('fatherId'),
  type: new LiteralFieldValidator(
    'type', true, { isArray: false }, 'string', [
      new TextStrictEqualValidationRule(offerCooperationContributionType)
    ]
  ),
}

export const offerCooperationContributionValidator = new DtoFieldValidator(
  'OfferCooperationContributionAr', true, { isArray: false }, 'dto', offerCooperationContributionVmap
)
