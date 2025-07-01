import type { AddingIsNotPermittedError } from "#app/domain/errors";
import type { UuidType } from "rilata/core";
import type { ContentSectionAttrs } from "../attrs";
import type { ContentSectionArMeta } from "../../meta";

// ========== commands ============
export type AddContentSectionCommand = {
  name: 'add-content-section',
  attrs: Omit<ContentSectionAttrs, 'id' | 'contents' | 'createAt' | 'updateAt'>,
  requestId: string,
};

// ========== success ============
export type AddContentSectionSuccess = { id: UuidType };

// ========== errors ============

// ========== uc-meta ============
export type AddContentSectionMeta = {
  name: 'Add Content Section Use Case'
  in: AddContentSectionCommand,
  success: AddContentSectionSuccess,
  errors: AddingIsNotPermittedError,
  events: never,
  aRoot: ContentSectionArMeta,
}
