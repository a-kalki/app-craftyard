import type { AggregateDoesNotExistError, EditingIsNotPermittedError } from "#app/domain/errors";
import type { ModelArMeta } from "../../meta";

// ========== commands ============
export type ReorderModelImagesCommand = {
  name: 'reorder-model-images',
  attrs: {
    id: string,
    reorderedImageIds: string[],
  },
  requestId: string,
};

// ========== success ============
export type ReorderModelsImageSuccess = 'success';

// ========== uc-meta ============
export type ReorderModelImagesMeta = {
  name: 'Reorder Model Images Use Case'
  in: ReorderModelImagesCommand,
  success: ReorderModelsImageSuccess,
  errors: AggregateDoesNotExistError | EditingIsNotPermittedError,
  events: never,
  aRoot: ModelArMeta,
}
