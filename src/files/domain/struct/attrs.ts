import type { AbstractAggregateAttrs } from "rilata/core";

export type FileEntryAttrs = AbstractAggregateAttrs & {
  url: string;
  mimeType: string;
  size: number;
  comment?: string;
  createAt: number;
  updateAt: number;
};
