import type { ModelArMeta } from "../meta";
import type { EditingIsNotPermitted } from "./add-images";
import type { ModelDoesNotExistError } from "./get-model";

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
  errors: ModelDoesNotExistError | EditingIsNotPermitted,
  events: never,
  aRoot: ModelArMeta,
}
