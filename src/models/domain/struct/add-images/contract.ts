import type { AggregateDoesNotExistError, EditingIsNotPermittedError } from "#app/core/errors";
import type { ModelArMeta } from "../../meta";

// ========== commands ============
export type AddModelImagesCommand = {
  name: 'add-model-images',
  attrs: {
    id: string,
    pushImageIds: string[],
  },
  requestId: string,
};

// ========== success ============
export type AddModelsImageSuccess = 'success';

// ========== uc-meta ============
export type AddModelImagesMeta = {
  name: 'Add Model Images Use Case'
  in: AddModelImagesCommand,
  success: AddModelsImageSuccess,
  errors: AggregateDoesNotExistError | EditingIsNotPermittedError,
  events: never,
  aRoot: ModelArMeta,
}
