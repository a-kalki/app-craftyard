import type { AddingIsNotPermittedError, AggregateDoesNotExistError } from "#app/domain/errors";
import type { Thesis } from "../attrs";
import type { ThesisSetArMeta } from "../../meta";

// ========== commands ============
export type AddThesisCommand = {
  name: 'add-thesis',
  attrs: {
    id: string,
    newThesisAttrs: Omit<Thesis, 'id'| 'createAt' | 'updateAt'>,
  },
  requestId: string,
};

// ========== success ============
export type AddThesisSuccess = { id: string };

// ========== uc-meta ============
export type AddThesisMeta = {
  name: 'Add Thesis Use Case'
  in: AddThesisCommand,
  success: AddThesisSuccess,
  errors: AggregateDoesNotExistError | AddingIsNotPermittedError,
  events: never,
  aRoot: ThesisSetArMeta,
}

