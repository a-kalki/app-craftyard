import type { AggregateDoesNotExistError, DeletingIsNotPermittedError } from "#app/core/errors";
import type { UserContentArMeta } from "../../meta";

// ========== commands ============
export type DeleteUserContentCommand = {
  name: 'delete-user-content',
  attrs: { sectionId: string, contentId: string },
  requestId: string,
};

// ========== success ============
export type DeleteUserContentSuccess = 'success';

// ========== uc-meta ============
export type DeleteUserContentMeta = {
  name: 'Delete User Content Use Case'
  in: DeleteUserContentCommand,
  success: DeleteUserContentSuccess,
  errors: AggregateDoesNotExistError | DeletingIsNotPermittedError,
  events: never,
  aRoot: UserContentArMeta,
}
