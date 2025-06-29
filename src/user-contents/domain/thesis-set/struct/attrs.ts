import type { ArticleAttrs } from "#user-contents/domain/article/struct/attrs";

export type Thesis = {
  id: string
  title: string; // maybe markdown
  body: string; // maybe markdown
  footer?: string  // maybe markdown
  order?: number;
  icon?: string;
  createAt: number;
  updateAt: number;
};

export type ThesisSetAttrs = Omit<ArticleAttrs, 'article' | 'type'> & {
  theses: Thesis[],
  order?: number,
  type:'thesis-set'
}
