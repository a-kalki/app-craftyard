import { DtoFieldValidator, LiteralFieldValidator, RangeNumberValidationRule, TextStrictEqualValidationRule, type ValidatorMap } from "rilata/validator";
import type { ExecutorAttrs } from "./attrs";
import { cooperationNodeVMap } from "#cooperations/domain/base/node/struct/v-map";
import { ownerIdValidator } from "#app/core/base-validators";

export const executorType: ExecutorAttrs['type'] = 'EXECUTOR';

export const executorVmap: ValidatorMap<ExecutorAttrs> = {
  id: cooperationNodeVMap.id,
  title: cooperationNodeVMap.title,
  responsibilities: cooperationNodeVMap.responsibilities,
  profitPercentage: new LiteralFieldValidator(
    'profitPercentage', true, { isArray: false }, 'number', [
      new RangeNumberValidationRule(0, 100),
    ]
  ),
  organizationId: cooperationNodeVMap.organizationId,
  ownerId: ownerIdValidator,
  type: new LiteralFieldValidator('type', true, { isArray: false }, 'string', [
    new TextStrictEqualValidationRule(executorType),
  ]),
  contextType: cooperationNodeVMap.contextType,
}

export const executorValidator = new DtoFieldValidator(
  'ExecutorAr', true, { isArray: false }, 'dto', executorVmap
)
