import type { Caller } from "rilata/core";
import type { DeleteFileCommand, DeleteFileResult } from "./struct/delete-file";
import type { GetFileCommand, GetFileEntryResult } from "./struct/get-file";
import type { UpdateFileCommand, UpdateFileResult } from "./struct/update-file";
import type { FileUploadResult, UploadFileCommand, UploadFileInput } from "./struct/upload-file";

export interface UiFileFacade {
  uploadFile(options: UploadFileInput): Promise<FileUploadResult>;

  getFile(id: string): Promise<GetFileEntryResult>;

  updateFile(id: string, attrs: UploadFileInput): Promise<UpdateFileResult>;

  deleteFile(id: string): Promise<DeleteFileResult>
}

export interface ApiFileFacade {
  uploadFile(input: UploadFileCommand, caller: Caller): Promise<FileUploadResult>;

  getFile(input: GetFileCommand, caller: Caller): Promise<GetFileEntryResult>;

  updateFile(input: UpdateFileCommand, caller: Caller): Promise<UpdateFileResult>;

  deleteFile(input: DeleteFileCommand, caller: Caller): Promise<DeleteFileResult>
}
