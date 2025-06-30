import type { AggregateDoesNotExistError, EditingIsNotPermittedError } from "#app/domain/errors";
import type { Thesis } from "../attrs";
import type { ThesisSetArMeta } from "../../meta";
import type { PatchValue } from "rilata/core";

// ========== commands ============
export type EditThesisCommand = {
  name: 'edit-thesis',
  attrs: {
    id: string,
    thesis: PatchValue<Omit<Thesis, 'createAt' | 'updateAt'>>,
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
