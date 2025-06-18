import { AggregateRoot } from "rilata/domain";
import type { FileEntryArMeta } from "./meta";
import type { FileEntryAttrs } from "./struct/attrs";
import { fileEntryValidator } from "./v-map";

export class FileAr extends AggregateRoot<FileEntryArMeta> {
  name = 'FileEntryAr' as const;

  getShortName(): string {
    return this.getAttrs().id;
  }

  constructor(attrs: FileEntryAttrs) {
    super(attrs, fileEntryValidator);
  }
}
