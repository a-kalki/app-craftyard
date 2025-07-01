import type { AggregateDoesNotExistError, EditingIsNotPermittedError } from "#app/domain/errors";
import type { PatchValue } from "rilata/core";
import type { ThesisContent } from "./thesis-attrs";
import type { UserContentArMeta } from "../meta";
import type { FileContent } from "./file-attrs";

export type EditThesistAttrs = PatchValue<Omit<ThesisContent, 'createAt' | 'updateAt'>>; 

export type EditFileContentAttrs = PatchValue<Omit<FileContent, 'createAt' | 'updateAt'>>; 

// ========== commands ============
export type EditUserContentCommand = {
  name: 'edit-user-content',
  attrs: EditThesistAttrs | EditFileContentAttrs,
  requestId: string,
};

// ========== success ============
export type EditUserContentSuccess = 'success';

// ========== uc-meta ============
export type EditUserContentMeta = {
  name: 'Edit User Content Use Case'
  in: EditUserContentCommand,
  success: EditUserContentSuccess,
  errors: AggregateDoesNotExistError | EditingIsNotPermittedError,
  events: never,
  aRoot: UserContentArMeta,
}
