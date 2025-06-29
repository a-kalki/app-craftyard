import type { AbstractAggregateAttrs } from "rilata/api-server";

export type ArticleAttrs = AbstractAggregateAttrs & {
  title: string,
  article: string,
  order?: number,
  icon?: string,
  type: 'article',
  createAt: number,
  updateAt: number,
}
