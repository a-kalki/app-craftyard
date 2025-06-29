import type { AggregateDoesNotExistError, EditingIsNotPermittedError } from "#app/domain/errors";
import type { Thesis } from "../attrs";
import type { ThesisSetArMeta } from "../../meta";

// ========== commands ============
export type EditThesisCommand = {
  name: 'edit-thesis',
  attrs: {
    id: string,
    thesis: Omit<Thesis, 'createAt' | 'updateAt'>,
  },
  requestId: string,
};

// ========== success ============
export type EditThesisSuccess = 'success';

// ========== uc-meta ============
export type EditThesisMeta = {
  name: 'Edit Thesis Use Case'
  in: EditThesisCommand,
  success: EditThesisSuccess,
  errors: AggregateDoesNotExistError | EditingIsNotPermittedError,
  events: never,
  aRoot: ThesisSetArMeta,
}
