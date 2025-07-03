import { html, type TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { markdownUtils } from '#app/ui/utils/markdown';
import type { ThesisContent } from '#user-contents/domain/content/struct/thesis-attrs';
import { BaseContentCard } from '../base-content/content-card';
import type { EditUserContentModalDialog } from '../base-content/types';

@customElement('thesis-card')
export class ThesisCard extends BaseContentCard<ThesisContent> {
  static styles = BaseContentCard.styles;

  protected createEditModal(): EditUserContentModalDialog {
    return document.createElement('edit-thesis-modal');
  }

  protected renderBodyContent(): TemplateResult {
    const { body } = this.content;
    return html`
      ${body
        ? html`<div class="markdown-content">${markdownUtils.parse(body)}</div>`
        : html`<slot name="body"></slot>`
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'thesis-card': ThesisCard;
  }
}
