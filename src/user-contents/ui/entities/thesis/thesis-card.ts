import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BaseElement } from '#app/ui/base/base-element';
import { markdownUtils } from '#app/ui/utils/markdown';
import type { ThesisContent } from '#user-contents/domain/content/struct/thesis-attrs';
import type { DeleteUserContentCommand } from '#user-contents/domain/content/struct/delete-content/contract';

@customElement('thesis-card')
export class ThesisCard extends BaseElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
      contain: content;
      position: relative;
    }

    sl-card {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 1rem;
      font-weight: 600;
    }

    .header-content {
      flex: 1;
    }

    .body {
      line-height: 1.6;
    }

    .footer {
      font-size: 0.875rem;
      color: var(--sl-color-neutral-600);
      padding-top: 0.75rem;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
      margin-left: 0.5rem;
    }

    .action-btn {
      --sl-button-font-size-small: 0.8rem;
      --sl-button-padding-small: 0.3rem 0.5rem;
    }

    /* Стили для Markdown контента */
    .markdown-content {
      font-size: .9rem;
    }

    .markdown-content p {
      margin: 0 0 1rem 0;
    }

    .markdown-content p:last-child {
      margin-bottom: 0;
    }

    .markdown-content ul, 
    .markdown-content ol {
      padding-left: 1.5rem;
      margin: 0 0 1rem 0;
    }

    .markdown-content h1, 
    .markdown-content h2, 
    .markdown-content h3, 
    .markdown-content h4, 
    .markdown-content h5, 
    .markdown-content h6 {
      margin: 1.5rem 0 1rem 0;
      font-weight: 600;
    }

    .markdown-content h1 { font-size: 1.8rem; }
    .markdown-content h2 { font-size: 1.5rem; }
    .markdown-content h3 { font-size: 1.3rem; }
    .markdown-content h4 { font-size: 1.1rem; }
    .markdown-content h5 { font-size: 1rem; }
    .markdown-content h6 { font-size: 0.9rem; }

    .markdown-content a {
      color: var(--sl-color-primary-600);
      text-decoration: none;
    }

    .markdown-content a:hover {
      text-decoration: underline;
    }

    .markdown-content code {
      background-color: var(--sl-color-neutral-100);
      padding: 0.2em 0.4em;
      border-radius: var(--sl-border-radius-small);
      font-family: var(--sl-font-mono);
      font-size: 0.85em;
    }

    .markdown-content pre {
      background-color: var(--sl-color-neutral-50);
      border-radius: var(--sl-border-radius-medium);
      padding: 1rem;
      overflow: auto;
    }

    .markdown-content blockquote {
      border-left: 4px solid var(--sl-color-neutral-200);
      padding-left: 1rem;
      margin: 0 0 1rem 0;
      color: var(--sl-color-neutral-600);
    }
  `;

  @property({ type: Object }) thesis!: ThesisContent;
  @property({ type: Boolean }) canEdit = false;

  private async confirmDelete() {
    if (!this.thesis) return;
    
    try {
      const confirmed = await this.app.showDialog({
        title: 'Удаление тезиса',
        content: 'Вы уверены, что хотите удалить этот тезис?',
        confirmVariant: 'danger',
        confirmText: 'Удалить',
        cancelText: 'Отмена',
      });
      
      if (confirmed) {
        const cmdAttrs: DeleteUserContentCommand['attrs'] = {
          sectionId: this.thesis.sectionId,
          contentId: this.thesis.id
        }
        const result = await this.userContentApi.deleteContent(cmdAttrs);
        if (result.isFailure()) {
          this.app.error(
            `[${this.constructor.name}]: Не удалось удалить тезис.`, { result: result.value },
          )
          return;
        }
      const event: CustomEvent<{ id: string }> = new CustomEvent(
        'thesis-deleted',
        { detail: { id: this.thesis.sectionId }, bubbles: true, composed: true }
      );
      this.dispatchEvent(event);
      }
    } catch (error) {
      this.app.error(`[${this.constructor.name}]: Ошибка при удалении тезиса.`, {error});
    }
  }

  private async handleEditThesis(): Promise<void> {
    const modal = document.createElement('edit-thesis-modal');

    try {
      const result = await modal.show(this.thesis);
      if (!result) return;

      const event: CustomEvent<{ id: string }> = new CustomEvent(
        'thesis-edited',
        { detail: { id: this.thesis.sectionId }, bubbles: true, composed: true }
      );
      this.dispatchEvent(event);
    } catch (error) {
      this.app.error(`[${this.constructor.name}]: Ошибка при редактировании тезиса.`, { error });
    }
  }

  render() {
    const { title, body, footer, icon } = this.thesis ?? {};

    return html`
      <sl-card>
        ${title
          ? html`
            <div slot="header" class="header">
              <div class="header-content">
                ${icon ? html`<sl-icon name=${icon}>&nbsp;</sl-icon>` : ''}
                ${markdownUtils.parseInline(title)}
              </div>
              ${this.canEdit ? html`
                <div class="actions">
                  <sl-tooltip content="Редактировать тезис" placement="bottom">
                    <sl-button 
                      class="action-btn"
                      size="small" 
                      @click=${this.handleEditThesis}
                      @contextmenu=${(e: Event) => e.preventDefault()}
                    >
                      <sl-icon name="pencil"></sl-icon>
                    </sl-button>
                  </sl-tooltip>
                  <sl-tooltip content="Удалить тезис" placement="bottom">
                    <sl-button 
                      class="action-btn"
                      size="small" 
                      variant="danger"
                      @click=${this.confirmDelete}
                      @contextmenu=${(e: Event) => e.preventDefault()}
                    >
                      <sl-icon name="trash"></sl-icon>
                    </sl-button>
                  </sl-tooltip>
                </div>
              ` : ''}
            </div>
          `
          : html`<slot name="header" slot="header"></slot>`
        }

        <div class="body">
          ${body
            ? html`<div class="markdown-content">${markdownUtils.parse(body)}</div>`
            : html`<slot name="body"></slot>`
          }
        </div>

        ${footer ? html`
          <div slot="footer" class="footer">
            <div class="markdown-content">${markdownUtils.parse(footer)}</div>
          </div>
        ` : html`
          <slot name="footer" slot="footer"></slot>
        `}
      </sl-card>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'thesis-card': ThesisCard;
  }
}
