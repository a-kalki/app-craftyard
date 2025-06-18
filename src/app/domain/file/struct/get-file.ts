import type { BackendResultByMeta } from "rilata/core";
import type { FileEntryAttrs } from "./attrs";
import type { FileEntryArMeta } from "../meta";

// ========== command ============
export type GetFileCommand = {
  name: 'get-file',
  attrs: { id: string },
  requestId: string,
}

// ========== errors ============
export type FileNotFoundError = {
  name: 'FileNotFoundError',
  description?: string,
  type: 'domain-error',
}

export type GettingFileIsNotPermittedError = {
  name: 'GettingFileIsNotPermittedError',
  description?: string,
  type: 'domain-error',
}

// ========== meta ============
export type GetFileUcMeta = {
  name: 'Get File Use Case'
  in: GetFileCommand,
  success: FileEntryAttrs,
  errors: FileNotFoundError | GettingFileIsNotPermittedError,
  events: never,
  aRoot: FileEntryArMeta,
}

export type GetFileEntryResult = BackendResultByMeta<GetFileUcMeta>;
