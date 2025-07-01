import type { AggregateDoesNotExistError, GettingIsNotPermittedError } from "#app/domain/errors";
import type { UserContent, UserContentArMeta } from "../../meta";

// ========== commands ============
export type GetUserContentCommand = {
  name: 'get-user-content',
  attrs: { sectionId: string, contentId: string },
  requestId: string,
};

// ========== success ============
export type GetUserContentSuccess = UserContent;

// ========== uc-meta ============
export type GetUserContentMeta = {
  name: 'Get User Content Use Case'
  in: GetUserContentCommand,
  success: GetUserContentSuccess,
  errors: AggregateDoesNotExistError | GettingIsNotPermittedError,
  events: never,
  aRoot: UserContentArMeta,
}
