import type { AbstractAggregateAttrs } from "rilata/core";

export type AccessType = 'public' | 'paid';

export type ContentSectionAttrs = AbstractAggregateAttrs & {
  access: AccessType,
  title: string,
  order?: number,
  icon?: string,
  createAt: number,
  updateAt: number,
}
