import type { AggregateDoesNotExistError, DeletingIsNotPermittedError } from "#app/domain/errors";
import type { ContentSectionArMeta } from "../../meta";

// ========== commands ============
export type DeleteContentSectionCommand = {
  name: 'delete-content-section',
  attrs: { id: string },
  requestId: string,
};

// ========== success ============
export type DeleteContentSectionSuccess = 'success';

// ========== uc-meta ============
export type DeleteContentSectionMeta = {
  name: 'Delete Content Section Use Case'
  in: DeleteContentSectionCommand,
  success: DeleteContentSectionSuccess,
  errors: DeletingIsNotPermittedError | AggregateDoesNotExistError,
  events: never,
  aRoot: ContentSectionArMeta,
}
