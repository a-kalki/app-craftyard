import type { DeleteFileResult } from "#files/domain/struct/delete-file/contract";
import type { GetFileEntryResult } from "#files/domain/struct/get-file/contract";
import type { UpdateFileResult } from "#files/domain/struct/update-file/contract";
import type { FileUploadResult, UploadFileInput } from "#files/domain/struct/upload-file/contract";

export interface UiFileFacade {
  uploadFile(options: UploadFileInput): Promise<FileUploadResult>;

  getFileEntry(id: string): Promise<GetFileEntryResult>;

  updateFileEntry(id: string, attrs: UploadFileInput): Promise<UpdateFileResult>;

  deleteFileEntry(id: string): Promise<DeleteFileResult>
}

