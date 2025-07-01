import type { ContentAttrs } from "../struct/attrs"

export type ArticleContent = ContentAttrs & {
  type: 'article',
  article: string,
}
