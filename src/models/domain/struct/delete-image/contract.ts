import type { AggregateDoesNotExistError, DeletingIsNotPermittedError } from "#app/domain/errors";
import type { ModelArMeta } from "../../meta";

// ========== commands ============
export type DeleteModelImageCommand = {
  name: 'delete-model-image',
  attrs: {
    id: string,
    imageId: string,
  },
  requestId: string,
};

// ========== success ============
export type DeleteModelImageSuccess = 'success';

// ========== uc-meta ============
export type DeleteModelImageMeta = {
  name: 'Delete Model Image Use Case'
  in: DeleteModelImageCommand,
  success: DeleteModelImageSuccess,
  errors: AggregateDoesNotExistError | DeletingIsNotPermittedError,
  events: never,
  aRoot: ModelArMeta,
}
