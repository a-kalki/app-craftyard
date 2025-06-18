import type { BackendResultByMeta } from "rilata/core";
import type { FileEntryAttrs } from "./attrs";
import type { FileEntryArMeta } from "../meta";
import type { FileNotFoundError } from "./get-file";

export type UpdateFileCommand = {
  name: string,
  attrs: {
    id: string,
    patch: Partial<Pick<FileEntryAttrs, 'comment' | 'access'>>,
  },
  requestId: string,
}

export type UpdateFileOutput = 'success';

export type UpdateFileUcMeta = {
  name: 'Update File Use Case'
  in: UpdateFileCommand,
  success: 'success',
  errors: FileNotFoundError,
  events: never,
  aRoot: FileEntryArMeta,
}

export type UpdateFileResult = BackendResultByMeta<UpdateFileUcMeta>;
