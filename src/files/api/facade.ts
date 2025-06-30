import type { FileModuleFacade } from "#files/domain/facade";
import type { DeleteFileCommand, DeleteFileUcMeta } from "#files/domain/struct/delete-file";
import type { BackendResultByMeta, Caller } from "rilata/core";
import type { FilesModule } from "./module";

export class FileModuleBackendFacade implements FileModuleFacade {
  constructor(private fileModule: FilesModule) {}

  async deleteFile(command: DeleteFileCommand, caller: Caller): Promise<BackendResultByMeta<DeleteFileUcMeta>> {
    return this.fileModule.handleRequest(
      command, { caller },
    ) as unknown as BackendResultByMeta<DeleteFileUcMeta>;
  }
}
