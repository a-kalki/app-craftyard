import type { AddingIsNotPermittedError } from "#app/domain/errors";
import type { UuidType } from "rilata/core";
import type { ThesisSetAttrs } from "../attrs";
import type { ThesisSetArMeta } from "../../meta";

// ========== commands ============
export type AddThesisSetCommand = {
  name: 'add-thesis-set',
  attrs: Omit<ThesisSetAttrs, 'id' | 'theses' | 'createAt' | 'updateAt' | 'type'>,
  requestId: string,
};

// ========== success ============
export type AddThesisSetSuccess = { id: UuidType };

// ========== errors ============

// ========== uc-meta ============
export type AddThesisSetMeta = {
  name: 'Add Thesis Set Use Case'
  in: AddThesisSetCommand,
  success: AddThesisSetSuccess,
  errors: AddingIsNotPermittedError,
  events: never,
  aRoot: ThesisSetArMeta,
}
