import { marked } from 'marked';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { html, type TemplateResult } from 'lit';

export class MarkdownProcessor {
  parse(content: string): TemplateResult {
    const parsed = marked.parse(content.trim()) as string;
    return html`${unsafeHTML(parsed)}`;
  }

  parseInline(content: string): TemplateResult {
    const parsed = marked.parseInline(content.trim()) as string;
    return html`${unsafeHTML(parsed)}`;
  }
}

export const markdownUtils = new MarkdownProcessor();
