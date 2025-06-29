import type { AggregateDoesNotExistError, EditingIsNotPermittedError } from "#app/domain/errors";
import type { ThesisSetAttrs } from "../attrs";
import type { ThesisSetArMeta } from "../../meta";

// ========== commands ============
export type EditThesisSetCommand = {
  name: 'edit-thesis-set',
  attrs: Pick<ThesisSetAttrs, 'id' | 'title' | 'icon' | 'order'>,
  requestId: string,
};

// ========== success ============
export type EditThesisSetSuccess = 'success';

// ========== uc-meta ============
export type EditThesisSetMeta = {
  name: 'Edit Thesis Set Use Case'
  in: EditThesisSetCommand,
  success: EditThesisSetSuccess,
  errors: EditingIsNotPermittedError | AggregateDoesNotExistError,
  events: never,
  aRoot: ThesisSetArMeta,
}
