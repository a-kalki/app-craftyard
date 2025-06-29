import type { BackendResultByMeta } from "rilata/core";
import type { FileEntryAttrs, SubDir } from "./attrs";
import type { FileEntryArMeta } from "../meta";

export type UploadFileInput = {
  comment?: string;
  access: 'public' | 'private';
  file: File;
  subDir?: SubDir;
  onProgress?: (progress: number) => void;
};

export type UploadFileCommand = {
  name: 'upload-file',
  attrs: Partial<Pick<FileEntryAttrs, 'comment' | 'access'>> & { file: unknown, subDir?: SubDir },
  requestId: string,
};

export type UploadFileSuccess = { id: string };

export type BadFileError = {
  name: 'Bad file Error',
  description?: string,
  type: 'domain-error',
}

export type UploadFileUcMeta = {
  name: 'Upload File Use Case'
  in: UploadFileCommand,
  success: UploadFileSuccess,
  errors: BadFileError,
  events: never,
  aRoot: FileEntryArMeta,
}

export type FileUploadResult = BackendResultByMeta<UploadFileUcMeta>;
