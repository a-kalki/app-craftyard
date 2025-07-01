import type { AddingIsNotPermittedError, AggregateDoesNotExistError } from "#app/domain/errors";
import type { UserContentArMeta } from "../../meta";
import type { FileContent } from "../file-attrs";
import type { ThesisContent } from "../thesis-attrs";

export type AddThesisAttrs = Omit<ThesisContent, 'id'| 'createAt' | 'updateAt'>;

export type AddFileContentAttrs = Omit<FileContent,  'id'| 'createAt' | 'updateAt'>;

// ========== commands ============
export type AddUserContentCommand = {
  name: 'add-content',
  attrs: AddThesisAttrs | AddFileContentAttrs,
  requestId: string,
};

// ========== success ============
export type AddUserContentSuccess = { contentId: string };

// ========== uc-meta ============
export type AddUserContentMeta = {
  name: 'Add Content Use Case'
  in: AddUserContentCommand,
  success: AddUserContentSuccess,
  errors: AggregateDoesNotExistError | AddingIsNotPermittedError,
  events: never,
  aRoot: UserContentArMeta,
}

