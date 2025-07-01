import type { ContentAttrs } from "./attrs";

export type ThesisContent = ContentAttrs & {
  type: 'THESIS',
  body: string; // maybe markdown
  footer?: string  // maybe markdown
}
