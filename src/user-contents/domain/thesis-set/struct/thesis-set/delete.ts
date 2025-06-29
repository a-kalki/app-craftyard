import type { AggregateDoesNotExistError, DeletingIsNotPermittedError } from "#app/domain/errors";
import type { ThesisSetArMeta } from "../../meta";

// ========== commands ============
export type DeleteThesisSetCommand = {
  name: 'delete-thesis-set',
  attrs: { id: string },
  requestId: string,
};

// ========== success ============
export type DeleteThesisSetSuccess = 'success';

// ========== uc-meta ============
export type DeleteThesisSetMeta = {
  name: 'Delete Thesis Set Use Case'
  in: DeleteThesisSetCommand,
  success: DeleteThesisSetSuccess,
  errors: DeletingIsNotPermittedError | AggregateDoesNotExistError,
  events: never,
  aRoot: ThesisSetArMeta,
}
