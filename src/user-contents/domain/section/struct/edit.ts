import type { AggregateDoesNotExistError, EditingIsNotPermittedError } from "#app/domain/errors";
import type { PatchValue } from "rilata/core";
import type { ContentSectionArMeta } from "../meta";
import type { ContentSectionAttrs } from "./attrs";

// ========== commands ============
export type EditContentSectionCommand = {
  name: 'edit-content-section',
  attrs: PatchValue<Pick<ContentSectionAttrs, 'id' | 'title' | 'icon' | 'order'>>,
  requestId: string,
};

// ========== success ============
export type EditContentSectionSuccess = 'success';

// ========== uc-meta ============
export type EditContentSectionMeta = {
  name: 'Edit Content Section Use Case'
  in: EditContentSectionCommand,
  success: EditContentSectionSuccess,
  errors: EditingIsNotPermittedError | AggregateDoesNotExistError,
  events: never,
  aRoot: ContentSectionArMeta,
}
