import type { BackendResultByMeta } from "rilata/core";
import type { FileEntryAttrs } from "../attrs";
import type { FileEntryArMeta } from "../../meta";
import type { AddingIsNotPermittedError } from "#app/domain/errors";
import type { CyOwnerAggregateAttrs } from "#app/domain/types";

export type UploadFileInput = CyOwnerAggregateAttrs & {
  comment?: string;
  file: File;
  onProgress?: (progress: number) => void;
};

export type UploadFileCommand = {
  name: 'upload-file',
  attrs: CyOwnerAggregateAttrs & Pick<FileEntryAttrs, 'comment'> & { file: unknown },
  requestId: string,
};

export type UploadFileSuccess = { id: string, url: string };

export type BadFileError = {
  name: 'Bad file Error',
  description?: string,
  type: 'domain-error',
}

export type UploadFileUcMeta = {
  name: 'Upload File Use Case'
  in: UploadFileCommand,
  success: UploadFileSuccess,
  errors: BadFileError | AddingIsNotPermittedError,
  events: never,
  aRoot: FileEntryArMeta,
}

export type FileUploadResult = BackendResultByMeta<UploadFileUcMeta>;
