import type { DeleteFileResult } from "#files/domain/struct/delete-file/contract";
import type { GetFileEntryResult } from "#files/domain/struct/get-file/contract";
import type { UpdateFileResult } from "#files/domain/struct/update-file/contract";
import type { FileUploadResult, UploadFileInput } from "#files/domain/struct/upload-file/contract";

export interface UiFileFacade {
  uploadFile(options: UploadFileInput): Promise<FileUploadResult>;

  getFile(id: string): Promise<GetFileEntryResult>;

  updateFile(id: string, attrs: UploadFileInput): Promise<UpdateFileResult>;

  deleteFile(id: string): Promise<DeleteFileResult>
}

