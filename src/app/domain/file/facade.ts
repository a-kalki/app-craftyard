import type { DeleteFileResult } from "./struct/delete-file";
import type { GetFileEntryResult } from "./struct/get-file";
import type { UpdateFileResult } from "./struct/update-file";
import type { FileUploadResult, UploadFileInput } from "./struct/upload-file";

export interface FileFacade {
  uploadFile(options: UploadFileInput): Promise<FileUploadResult>;

  getFile(id: string): Promise<GetFileEntryResult>;

  updateFile(id: string, attrs: UploadFileInput): Promise<UpdateFileResult>;

  deleteFile(id: string): Promise<DeleteFileResult>
}
