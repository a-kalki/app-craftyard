import { DtoFieldValidator, LiteralFieldValidator, RangeNumberValidationRule, TextStrictEqualValidationRule, type ValidatorMap } from "rilata/validator";
import { cooperationAttrsVmap } from "#cooperation/domain/base/childable/struct/v-map";
import type { OrganizationCooperationAttrs } from "./attrs";
import { offerCooperationContributionVmap } from "../../offer/struct/v-map";

export const organizationCooperationType: OrganizationCooperationAttrs['type'] =
  'ORGANIZATION_COOPERATION';

export const organizationCooperationVmap: ValidatorMap<OrganizationCooperationAttrs> = {
  id: cooperationAttrsVmap.id,
  title: cooperationAttrsVmap.title,
  responsibilities: cooperationAttrsVmap.responsibilities,
  childrenIds: cooperationAttrsVmap.childrenIds,
  fatherId: offerCooperationContributionVmap.fatherId.cloneWithRequired(false),
  type: new LiteralFieldValidator(
    'type', true, { isArray: false }, 'string', [
      new TextStrictEqualValidationRule(organizationCooperationType)
    ]
  ),
  commissionPercentage: new LiteralFieldValidator(
      'commissionPercentage', true, { isArray: false }, 'number', [
      new RangeNumberValidationRule(0, 100),
  ]
  ),
}

export const organizationCooperationValidator = new DtoFieldValidator(
  'OrganizationCooperationAr', true, { isArray: false }, 'dto', organizationCooperationVmap
)
