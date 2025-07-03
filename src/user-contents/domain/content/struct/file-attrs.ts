import type { ContentAttrs } from "./attrs";

export type FileType = 'PDF' | 'VIDEO';

export type FileContent = ContentAttrs & {
  type: 'FILE';
  fileId: string;
  fileType: FileType;
  thumbnailId?: string;
  description?: string; // maybe markdown
}
