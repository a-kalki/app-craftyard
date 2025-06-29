import type { AggregateDoesNotExistError, DeletingIsNotPermittedError } from "#app/domain/errors";
import type { ThesisSetArMeta } from "../../meta";

// ========== commands ============
export type DeleteThesisCommand = {
  name: 'delete-thesis',
  attrs: {
    id: string,
    thesisId: string,
  },
  requestId: string,
};

// ========== success ============
export type DeleteThesisSuccess = 'success';

// ========== uc-meta ============
export type DeleteThesisMeta = {
  name: 'Delete Thesis Use Case'
  in: DeleteThesisCommand,
  success: DeleteThesisSuccess,
  errors: AggregateDoesNotExistError | DeletingIsNotPermittedError,
  events: never,
  aRoot: ThesisSetArMeta,
}
