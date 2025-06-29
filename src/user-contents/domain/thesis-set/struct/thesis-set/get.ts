import type { AggregateDoesNotExistError, GettingIsNotPermittedError } from "#app/domain/errors";
import type { ThesisSetArMeta } from "../../meta";
import type { ThesisSetAttrs } from "../attrs";

// ========== commands ============
export type GetThesisSetCommand = {
  name: 'get-thesis-set',
  attrs: { id: string },
  requestId: string,
};

// ========== success ============
export type GetThesisSetSuccess = ThesisSetAttrs;

// ========== uc-meta ============
export type GetThesisSetMeta = {
  name: 'Get Thesis Set Use Case'
  in: GetThesisSetCommand,
  success: GetThesisSetSuccess,
  errors: AggregateDoesNotExistError | GettingIsNotPermittedError,
  events: never,
  aRoot: ThesisSetArMeta,
}
