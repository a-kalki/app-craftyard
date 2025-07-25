import {
  DtoFieldValidator, LiteralFieldValidator, RangeNumberValidationRule,
  TextStrictEqualValidationRule, type ValidatorMap,
} from "rilata/validator";
import type { CommandCooperationAttrs } from "./attrs";
import { childableAttrsVmap } from "#cooperations/domain/base/childable/struct/v-map";

export const commandCooperationType: CommandCooperationAttrs['type'] =
  'COMMAND_COOPERATION';

export const commandCooperationVmap: ValidatorMap<CommandCooperationAttrs> = {
  id: childableAttrsVmap.id,
  title: childableAttrsVmap.title,
  responsibilities: childableAttrsVmap.responsibilities,
  childrenIds: childableAttrsVmap.childrenIds,
  type: new LiteralFieldValidator(
    'type', true, { isArray: false }, 'string', [
      new TextStrictEqualValidationRule(commandCooperationType)
    ]
  ),
  organizationId: childableAttrsVmap.organizationId,
  contextType: childableAttrsVmap.contextType,
  profitPercentage: new LiteralFieldValidator(
    'profitPercentage', true, { isArray: false }, 'number', [
      new RangeNumberValidationRule(0, 100),
    ]
  ),
}

export const commandCooperationValidator = new DtoFieldValidator(
  'CommandCooperationAr', true, { isArray: false }, 'dto', commandCooperationVmap
)
