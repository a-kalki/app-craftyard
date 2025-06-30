import type { BackendResultByMeta, Caller } from "rilata/core";
import type { DeleteFileCommand, DeleteFileUcMeta } from "./struct/delete-file";

export interface FileModuleFacade {
  deleteFile(command: DeleteFileCommand, caller: Caller): Promise<BackendResultByMeta<DeleteFileUcMeta>>
}
