import type { ModelArMeta } from "../meta";
import type { EditingIsNotPermitted } from "./add-images";
import type { ModelDoesNotExistError } from "./get-model";

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
  errors: ModelDoesNotExistError | EditingIsNotPermitted,
  events: never,
  aRoot: ModelArMeta,
}
