import { css, html, type TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { markdownUtils } from '#app/ui/utils/markdown';
import type { FileContent } from '#user-contents/domain/content/struct/file-attrs';
import { BaseContentCard } from '../base-content/content-card';
import type { EditUserContentModalDialog } from '../base-content/types';

import '#user-contents/ui/entities/pdf/edit-pdf-content';


@customElement('pdf-card')
export class PdfCard extends BaseContentCard<FileContent> {
  static styles = [
    BaseContentCard.styles,
    css`
      .file-preview {
        margin-bottom: 1rem;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100px;
        background-color: var(--sl-color-neutral-50);
        border: 1px solid var(--sl-color-neutral-200);
        border-radius: var(--sl-border-radius-medium);
        overflow: hidden;
      }

      .file-preview img {
        max-width: 100%;
        max-height: 200px;
        object-fit: contain;
      }

      /* Стиль для дефолтной иконки */
      .file-preview .default-icon {
        font-size: 3rem;
        color: var(--sl-color-primary-500);
      }
    `
  ];

  protected createEditModal(): EditUserContentModalDialog {
    return document.createElement('edit-pdf-modal');
  }

  protected renderButtons(): TemplateResult {
    return html`
      ${this.fileUrl ? html`
        <sl-tooltip content="Скачать файл" placement="bottom">
          <sl-button
            class="action-btn"
            size="small"
            variant="primary"
            href=${this.fileUrl}
            target="_blank"
            download="${this.content.title || 'document'}.pdf"
          >
            <sl-icon name="download"></sl-icon>
          </sl-button>
        </sl-tooltip>
      ` : ''}
      ${super.renderButtons()}
    `;
  }

  protected renderBodyContent(): TemplateResult {
    const { description } = this.content;
    return html`
      <div class="file-preview">
        ${this.thumbUrl ? html`
          <img src=${this.thumbUrl} alt="PDF Preview">
        ` : html`
          <sl-icon name="file-earmark-pdf" class="default-icon"></sl-icon>
        `}
      </div>

      ${description
        ? html`<div class="markdown-content">${markdownUtils.parse(description)}</div>`
        : html`<slot name="description"></slot>`
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pdf-card': PdfCard;
  }
}
