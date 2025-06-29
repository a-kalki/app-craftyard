import type { GetContentPayload, NotContentToDeliveryError } from "rilata/api-server";
import type { ThesisSetArMeta } from "../../meta";

// ========== commands ============
export type GetThesisSetContentCommand = {
  name: 'get-thesis-sets-content',
  attrs: GetContentPayload,
  requestId: string,
};

// ========== success ============
export type GetThesisSetContentSuccess = {
  title?: string,
  body?: string,
};

// ========== uc-meta ============
export type GetThesisSetContentMeta = {
  name: 'Get Thesis Sets Content Use Case'
  in: GetThesisSetContentCommand,
  success: GetThesisSetContentSuccess,
  errors: NotContentToDeliveryError,
  events: never,
  aRoot: ThesisSetArMeta,
}
