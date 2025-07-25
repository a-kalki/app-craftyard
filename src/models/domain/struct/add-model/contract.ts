import type { AggregateDoesNotExistError, AddingIsNotPermittedError } from "#app/core/errors";
import type { ModelArMeta } from "../../meta";
import type { ModelAttrs } from "../attrs";

// ========== commands ============
export type AddModelCommand = {
  name: 'add-model',
  attrs: Omit<ModelAttrs, 'id' | 'imageIds' | 'createAt' | 'updateAt' | 'ownerId'>,
  requestId: string,
};

// ========== success ============
export type AddModelSuccess = { modelId: string };

// ========== uc-meta ============
export type AddModelMeta = {
  name: 'Add Model Use Case'
  in: AddModelCommand,
  success: AddModelSuccess,
  errors: AggregateDoesNotExistError | AddingIsNotPermittedError,
  events: never,
  aRoot: ModelArMeta,
}
