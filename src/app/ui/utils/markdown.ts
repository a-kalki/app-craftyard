import { marked } from 'marked';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { html, type TemplateResult } from 'lit';

marked.setOptions({
  breaks: true,
});

export class MarkdownProcessor {
  parse(content: string): TemplateResult {
    const parsed = marked.parse(content.trim()) as string;
    return html`${unsafeHTML(parsed)}`;
  }

  parseInline(content: string): TemplateResult {
    const parsed = marked.parseInline(content.trim()) as string;
    return html`${unsafeHTML(parsed)}`;
  }

  parseWithOptions(
    content: string,
    options: {
      tag?: string;
      class?: string;
      id?: string;
      [attr: string]: string | undefined;
    } = { tag: 'p' }
  ): TemplateResult {
    const tag = options.tag || 'p';
    delete options.tag;
    
    const attrStr = Object.entries(options)
      .filter(([_, val]) => val !== undefined)
      .map(([key, val]) => `${key}="${val}"`)
      .join(' ');

    const tagOpen = `<${tag}${attrStr ? ' ' + attrStr : ''}>`;
    const tagClose = `</${tag}>`;

    const parsed = marked.parseInline(content.trim()) as string;
    return html`${unsafeHTML(tagOpen + parsed + tagClose)}`;
  }
}

export const markdownUtils = new MarkdownProcessor();
