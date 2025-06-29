import type { AggregateDoesNotExistError } from "#app/domain/errors";
import type { ModelArMeta } from "../meta";
import type { ModelAttrs } from "./attrs";

// ========== commands ============
export type GetModelCommand = {
  name: 'get-model',
  attrs: { id: string },
  requestId: string,
};

// ========== success ============
export type GetModelSuccess = ModelAttrs;

// ========== uc-meta ============
export type GetModelMeta = {
  name: 'Get Model Use Case'
  in: GetModelCommand,
  success: GetModelSuccess,
  errors: AggregateDoesNotExistError,
  events: never,
  aRoot: ModelArMeta,
}
