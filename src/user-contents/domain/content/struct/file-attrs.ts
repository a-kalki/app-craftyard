import type { ContentAttrs } from "./attrs";

export type FileType = 'PDF' | 'VIDEO';

export type FileContent = ContentAttrs & {
  fileId: string;
  type: 'FILE';
  fileType: FileType;
  thumbnailId?: string;
  description?: string; // maybe markdown
}
