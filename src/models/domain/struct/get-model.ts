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

// ========== errors ============
export type ModelDoesNotExistError = {
  name: 'ModelDoesNotExistError',
  type: 'domain-error',
};

// ========== uc-meta ============
export type GetModelMeta = {
  name: 'Get Model Use Case'
  in: GetModelCommand,
  success: GetModelSuccess,
  errors: ModelDoesNotExistError,
  events: never,
  aRoot: ModelArMeta,
}
