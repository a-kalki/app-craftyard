import type { AggregateDoesNotExistError, EditingIsNotPermittedError } from "#app/domain/errors";
import type { PatchValue } from "rilata/core";
import type { ModelArMeta } from "../../meta";
import type { ModelAttrs } from "../attrs";

// ========== commands ============
export type EditModelCommand = {
  name: 'edit-model',
  attrs: PatchValue<Omit<ModelAttrs, 'ownerId' | 'imageIds' | 'createAt' | 'updateAt'>>,
  requestId: string,
};

// ========== success ============
export type EditModelSuccess = 'success';

// ========== uc-meta ============
export type EditModelMeta = {
  name: 'Edit Model Use Case'
  in: EditModelCommand,
  success: EditModelSuccess,
  errors: AggregateDoesNotExistError | EditingIsNotPermittedError,
  events: never,
  aRoot: ModelArMeta,
}
