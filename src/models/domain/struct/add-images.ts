import type { ModelArMeta } from "../meta";
import type { ModelDoesNotExistError } from "./get-model";

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

// ========== errors ============
export type EditingIsNotPermitted = {
  name: 'EditingIsNotPermitted',
  description?: string,
  type: 'domain-error',
}

// ========== uc-meta ============
export type AddModelImagesMeta = {
  name: 'Add Model Images Use Case'
  in: AddModelImagesCommand,
  success: AddModelsImageSuccess,
  errors: ModelDoesNotExistError | EditingIsNotPermitted,
  events: never,
  aRoot: ModelArMeta,
}
