import {
  DtoFieldValidator, LiteralFieldValidator, RangeNumberValidationRule,
  TextStrictEqualValidationRule, type ValidatorMap,
} from "rilata/validator";
import type { CommandCooperationAttrs } from "./attrs";
import { cooperationAttrsVmap } from "#cooperation/domain/base/childable/struct/v-map";

export const commandCooperationType: CommandCooperationAttrs['type'] =
  'COMMAND_COOPERATION';

export const commandCooperationVmap: ValidatorMap<CommandCooperationAttrs> = {
  id: cooperationAttrsVmap.id,
  title: cooperationAttrsVmap.title,
  responsibilities: cooperationAttrsVmap.responsibilities,
  childrenIds: cooperationAttrsVmap.childrenIds,
  editorIds: cooperationAttrsVmap.editorIds,
  type: new LiteralFieldValidator(
    'type', true, { isArray: false }, 'string', [
      new TextStrictEqualValidationRule(commandCooperationType)
    ]
  ),
  profitePercentage: new LiteralFieldValidator(
    'profitePercentage', true, { isArray: false }, 'number', [
      new RangeNumberValidationRule(0, 100),
    ]
  ),
}

export const commandCooperationValidator = new DtoFieldValidator(
  'CommandCooperationAr', true, { isArray: false }, 'dto', commandCooperationVmap
)
