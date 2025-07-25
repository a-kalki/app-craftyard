import { DtoFieldValidator, LiteralFieldValidator, RangeNumberValidationRule, TextStrictEqualValidationRule, type ValidatorMap } from "rilata/validator";
import { childableAttrsVmap } from "#cooperations/domain/base/childable/struct/v-map";
import type { OrganizationCooperationAttrs } from "./attrs";
import { offerCooperationContributionVmap } from "../../offer/struct/v-map";
import { editorIdsValidator } from "#app/core/base-validators";

export const organizationCooperationType: OrganizationCooperationAttrs['type'] =
  'ORGANIZATION_COOPERATION';

export const organizationCooperationVmap: ValidatorMap<OrganizationCooperationAttrs> = {
    id: childableAttrsVmap.id,
    title: childableAttrsVmap.title,
    responsibilities: childableAttrsVmap.responsibilities,
    childrenIds: childableAttrsVmap.childrenIds,
    fatherId: offerCooperationContributionVmap.fatherId.cloneWithRequired(false),
    editorIds: editorIdsValidator,
    type: new LiteralFieldValidator(
        'type', true, { isArray: false }, 'string', [
        new TextStrictEqualValidationRule(organizationCooperationType)
    ]
    ),
    contextType: childableAttrsVmap.contextType,
    organizationId: childableAttrsVmap.organizationId,
    commissionPercentage: new LiteralFieldValidator(
      'commissionPercentage', true, { isArray: false }, 'number', [
      new RangeNumberValidationRule(0, 100),
    ]
    ),
}

export const organizationCooperationValidator = new DtoFieldValidator(
  'OrganizationCooperationAr', true, { isArray: false }, 'dto', organizationCooperationVmap
)
