import type { ModelArMeta } from "../meta";
import type { ModelAttrs } from "./attrs";

// ========== commands ============
export type GetModelsCommand = {
  name: 'get-models',
  attrs: {},
  requestId: string,
};

// ========== success ============
export type GetModelsSuccess = ModelAttrs[];

// ========== uc-meta ============
export type GetModelsMeta = {
  name: 'Get Model Use Case'
  in: GetModelsCommand,
  success: GetModelsSuccess,
  errors: never,
  events: never,
  aRoot: ModelArMeta,
}
