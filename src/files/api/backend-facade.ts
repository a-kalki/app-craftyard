import type { ApiFileFacade } from "#app/domain/file/facade";
import type { DeleteFileCommand, DeleteFileResult } from "#app/domain/file/struct/delete-file";
import type { GetFileCommand, GetFileEntryResult } from "#app/domain/file/struct/get-file";
import type { UpdateFileCommand, UpdateFileResult } from "#app/domain/file/struct/update-file";
import type { FileUploadResult, UploadFileCommand } from "#app/domain/file/struct/upload-file";
import type { FilesModule } from "./module";
import type { Caller } from "rilata/core";

export class FilesBackendFacade implements ApiFileFacade {
    constructor(private module: FilesModule) {}

    uploadFile(input: UploadFileCommand, caller: Caller): Promise<FileUploadResult> {
      return this.module.handleRequest(input, { caller }) as Promise<FileUploadResult>;
    }

    getFile(input: GetFileCommand, caller: Caller): Promise<GetFileEntryResult> {
      return this.module.handleRequest(input, { caller }) as Promise<GetFileEntryResult>;
    }

    updateFile(command: UpdateFileCommand, caller: Caller): Promise<UpdateFileResult> {
      return this.module.handleRequest(command, { caller }) as Promise<UpdateFileResult>;
    }

    deleteFile(command: DeleteFileCommand, caller: Caller): Promise<DeleteFileResult> {
      return this.module.handleRequest(command, { caller }) as Promise<DeleteFileResult>;
    }

}
