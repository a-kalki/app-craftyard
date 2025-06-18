import type { BackendResultByMeta } from "rilata/core";
import type { FileEntryArMeta } from "../meta";

export type DeleteFileCommand = {
  name: 'delete-file',
  attrs: { id: string },
  requestId: string,
}

export type DeleteFileOutput = 'success';

export type DeleteFileUcMeta = {
  name: 'Delete File Use Case'
  in: DeleteFileCommand,
  success: DeleteFileOutput,
  errors: never,
  events: never,
  aRoot: FileEntryArMeta,
}

export type DeleteFileResult = BackendResultByMeta<DeleteFileUcMeta>;

