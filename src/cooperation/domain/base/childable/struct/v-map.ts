import {
  LiteralFieldValidator, type ValidatorMap
} from "rilata/validator";
import type { ChildableAttrs } from "./attrs";
import { cooperationNodeVMap } from "../../node/struct/v-map";
import { uuidRule } from "#app/domain/base-validators";

export const childableAttrsVmap: ValidatorMap<ChildableAttrs> = {
  id: cooperationNodeVMap.id,
  title: cooperationNodeVMap.title,
  responsibilities: cooperationNodeVMap.responsibilities,
  organizationId: cooperationNodeVMap.organizationId,
  childrenIds: new LiteralFieldValidator(
      'childrenIds', true, { isArray: true }, 'string', [uuidRule]
  ),
  type: cooperationNodeVMap.type,
  contextType: cooperationNodeVMap.contextType,
}
