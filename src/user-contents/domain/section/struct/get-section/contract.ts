import type { AggregateDoesNotExistError, GettingIsNotPermittedError } from "#app/core/errors";
import type { ContentSectionArMeta } from "../../meta";
import type { ContentSectionAttrs } from "../attrs";

// ========== commands ============
export type GetContentSectionCommand = {
  name: 'get-content-section',
  attrs: { id: string },
  requestId: string,
};

// ========== success ============
export type GetContentSectionSuccess = ContentSectionAttrs;

// ========== uc-meta ============
export type GetContentSectionMeta = {
  name: 'Get Content Section Use Case'
  in: GetContentSectionCommand,
  success: GetContentSectionSuccess,
  errors: AggregateDoesNotExistError | GettingIsNotPermittedError,
  events: never,
  aRoot: ContentSectionArMeta,
}
