import type { ContentAttrs } from "./attrs";

export type ImagesContent = ContentAttrs & {
  type: 'IMAGES';
  imageIds: string[];
  description?: string; // maybe markdown
}
