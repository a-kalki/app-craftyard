import { html, css, type TemplateResult, type CSSResultGroup } from 'lit';
import { property, state } from 'lit/decorators.js';
import { BaseElement } from '#app/ui/base/base-element';
import type { DeleteUserContentCommand } from '#user-contents/domain/content/struct/delete-content/contract';
import { markdownUtils } from '#app/ui/utils/markdown';
import type { EditUserContentModalDialog } from './types';
import type { CyOwnerAggregateAttrs } from '#app/domain/types';
import type { UserContent } from '#user-contents/domain/content/meta';
import type { FileContent } from '#user-contents/domain/content/struct/file-attrs';

export abstract class BaseContentCard<T extends UserContent> extends BaseElement {
  static styles: CSSResultGroup = css`
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
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .body {
      line-height: 1.6;
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
      margin: 0;
    }

    .markdown-content p + ul,
    .markdown-content p + ol {
      margin-top: 0.5rem;
    }

    .markdown-content h1 + ul,
    .markdown-content h2 + ul,
    .markdown-content h3 + ul,
    .markdown-content h4 + ul,
    .markdown-content h5 + ul,
    .markdown-content h6 + ul,
    .markdown-content h1 + ol,
    .markdown-content h2 + ol,
    .markdown-content h3 + ol,
    .markdown-content h4 + ol,
    .markdown-content h5 + ol,
    .markdown-content h6 + ol {
      margin-top: 0.25rem;
    }

    .markdown-content h1,
    .markdown-content h2,
    .markdown-content h3,
    .markdown-content h4,
    .markdown-content h5,
    .markdown-content h6 {
      margin: 1.5rem 0 0.5rem 0;
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

  @property({ type: Boolean }) canEdit = false;
  @property({ type: Object }) content!: T;
  @property({ type: Object }) ownerAttrs!: CyOwnerAggregateAttrs;

  @state() fileUrl?: string;
  @state() thumbUrl?: string;
  @state() protected isPlaying = false; // Добавляем состояние для управления воспроизведением

  protected abstract renderBodyContent(): TemplateResult;

  protected abstract createEditModal(): EditUserContentModalDialog;

  connectedCallback(): void {
    super.connectedCallback();
    this.loadUrls();
  }

  protected async loadUrls(): Promise<void> {
    if (!this.isFileContent(this.content)) return;

    if (this.content.fileId) {
      const fileResult = await this.fileApi.getFileEntry(this.content.fileId);
      if (fileResult.isSuccess()) {
        this.fileUrl = fileResult.value.url;
      } else {
        this.app.error(
          `[${this.constructor.name}]: Не удалось загрузить URL файла для ID: ${this.content.fileId}`,
        );
        this.fileUrl = undefined;
      }
    } else {
      this.fileUrl = undefined;
    }

    if (this.content.thumbnailId) {
      const thumbResult = await this.fileApi.getFileEntry(this.content.thumbnailId);
      if (thumbResult.isSuccess()) {
        this.thumbUrl = thumbResult.value.url;
      } else {
        this.app.error(
          `[${this.constructor.name}]: Не удалось загрузить URL миниатюры для ID: ${this.content.thumbnailId}`,
        );
        this.thumbUrl = undefined;
      }
    } else {
      this.thumbUrl = undefined;
    }
  }

  protected async handleEditContent(): Promise<void> {
    try {
      const modal = this.createEditModal();
      const result = await modal.show(this.content, this.ownerAttrs);
      if (result) {
        this.dispatchEditedEvent();
        await this.loadUrls();
      }
    } catch (error) {
      this.app.error(`[${this.constructor.name}]: Ошибка при редактировании контента.`, { error });
    }
  }

  protected isFileContent(content: { type: string }): content is FileContent {
    return content.type === 'FILE';
  }

  protected async handleDeleteContent() {
    if (!this.content) return;

    try {
      const confirmed = await this.app.showDialog({
        title: 'Удаление контента',
        content: 'Вы уверены, что хотите удалить этот контент?',
        confirmVariant: 'danger',
        confirmText: 'Удалить',
        cancelText: 'Отмена',
      });

      if (confirmed) {
        const cmdAttrs: DeleteUserContentCommand['attrs'] = {
          sectionId: this.content.sectionId,
          contentId: this.content.id
        }
        const result = await this.userContentApi.deleteContent(cmdAttrs);
        if (result.isFailure()) {
          this.app.error(
            `[${this.constructor.name}]: Не удалось удалить контент.`, { result: result.value },
          )
          return;
        }
        this.dispatchDeletedEvent();
      }
    } catch (error) {
      this.app.error(`[${this.constructor.name}]: Ошибка при удалении контента.`, { error });
    }
  }

  protected dispatchEditedEvent() {
    this.dispatchEvent(new CustomEvent('content-edited', {
      detail: { contentId: this.content.id }, bubbles: true, composed: true
    }));
  }

  protected dispatchDeletedEvent() {
    this.dispatchEvent(new CustomEvent('content-deleted', {
      detail: { contentId: this.content.id }, bubbles: true, composed: true
    }));
  }

  protected renderHeaderContent(): TemplateResult {
    const { title, icon } = this.content;
    return html`
        ${title
          ? html`
            <div slot="header" class="header">
              <div class="header-content">
                ${icon ? html`<sl-icon name=${icon}>&nbsp;</sl-icon>` : ''}
                ${title}
              </div>
              ${this.canEdit ? html`
                <div class="actions">
                  ${this.renderButtons()}
                </div>
              ` : ''}
            </div>
          `
          : html`<slot name="header" slot="header"></slot>`
        }`;
  }

  protected renderFooterContent(): TemplateResult {
    const { footer } = this.content;
    return html`
      ${footer ? html`
        <div slot="footer" class="footer">
          <div class="markdown-content">${markdownUtils.parse(footer)}</div>
        </div>
      ` : html`
        <slot name="footer" slot="footer"></slot>
      `}
    `;
  }

  protected renderButtons(): TemplateResult {
    return html`
      <sl-tooltip content="Редактировать контент" placement="bottom">
        <sl-button
          class="action-btn"
          size="small"
          @click=${this.handleEditContent}
          @contextmenu=${(e: Event) => e.preventDefault()}
        >
          <sl-icon name="pencil"></sl-icon>
        </sl-button>
      </sl-tooltip>

      <sl-tooltip content="Удалить контент" placement="bottom">
        <sl-button
          class="action-btn"
          size="small"
          variant="danger"
          @click=${this.handleDeleteContent}
          @contextmenu=${(e: Event) => e.preventDefault()}
        >
          <sl-icon name="trash"></sl-icon>
        </sl-button>
      </sl-tooltip>
    `;
  }

  // Методы для управления воспроизведением видео
  protected playContent() {
    this.isPlaying = true;
    this.requestUpdate(); // Убеждаемся, что Lit обновит DOM
  }

  protected stopContent() {
    this.isPlaying = false;
    this.requestUpdate();
  }

  render(): TemplateResult {
    if (!this.content || !this.ownerAttrs) return html`<sl-card>Данные не загружены.</sl-card>`;

    return html`
      <sl-card>
        ${this.renderHeaderContent()}

        <div class="body">
          ${this.renderBodyContent()}
        </div>

        <div slot="footer">
          ${this.renderFooterContent()}
        </div>
      </sl-card>
    `;
  }
}
