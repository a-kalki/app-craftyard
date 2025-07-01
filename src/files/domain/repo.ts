import type { MaybePromise } from "rilata/core";
import type { FileEntryAttrs } from "./struct/attrs";
import type { UpdateFileCommand } from "./struct/update-file/contract";

export interface FileRepo {
  findFile(id: string): MaybePromise<FileEntryAttrs | undefined>

  getFiles(): MaybePromise<FileEntryAttrs[]>

  editFile(id: string, attrs: UpdateFileCommand['attrs']): MaybePromise<{ changes: number }>

  addFile(attrs: FileEntryAttrs): MaybePromise<{ changes: number }>

  deleteFile(id: string): MaybePromise<{ changes: number }>
}
