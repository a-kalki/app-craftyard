import { LiteralFieldValidator, type ValidatorMap } from "rilata/validator";
import type { CooperationNodeAttrs } from "./attrs";
import { cannotBeEmptyRule, editorIdsValidator, titleValidator, uuidFieldValidator } from "#app/domain/base-validators";

export const cooperationNodeVMap: ValidatorMap<CooperationNodeAttrs> = {
  id: uuidFieldValidator,
  title: titleValidator,
  responsibilities: new LiteralFieldValidator(
      'responsibilities', true, { isArray: true }, 'string', [cannotBeEmptyRule]
  ),
  editorIds: editorIdsValidator,
  type: new LiteralFieldValidator('type', true, { isArray: false }, 'string', []),
}
