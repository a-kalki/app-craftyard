import type { DeleteFileResult } from "../domain/struct/delete-file";
import type { GetFileEntryResult } from "../domain/struct/get-file";
import type { UpdateFileResult } from "../domain/struct/update-file";
import type { FileUploadResult, UploadFileInput } from "../domain/struct/upload-file";

export interface FileApi {
  uploadFile(options: UploadFileInput): Promise<FileUploadResult>;

  getFile(id: string): Promise<GetFileEntryResult>;

  updateFile(id: string, attrs: UploadFileInput): Promise<UpdateFileResult>;

  deleteFile(id: string): Promise<DeleteFileResult>
}
