import type { AggregateDoesNotExistError, GettingIsNotPermittedError } from "#app/domain/errors";
import type { UserContent, UserContentArMeta } from "../../meta";

// ========== commands ============
export type GetSectionContentsCommand = {
  name: 'get-section-user-contents',
  attrs: { sectionId: string },
  requestId: string,
};

// ========== success ============
export type GetSectionContentsSuccess = UserContent[];

// ========== uc-meta ============
export type GetSectionContentsMeta = {
  name: 'Get Section Contents Use Case'
  in: GetSectionContentsCommand,
  success: GetSectionContentsSuccess,
  errors: AggregateDoesNotExistError | GettingIsNotPermittedError,
  events: never,
  aRoot: UserContentArMeta,
}
