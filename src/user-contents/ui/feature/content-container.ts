import { html, css, type TemplateResult, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { BaseElement } from '#app/ui/base/base-element';
import { markdownUtils } from '#app/ui/utils/markdown';
import { keyboardUtils } from '#app/ui/utils/keyboard';
import type { ContentSectionAttrs } from '#user-contents/domain/section/struct/attrs';
import type { CyOwnerAggregateAttrs } from '#app/domain/types';

@customElement('content-container')
export class ContentContainer extends BaseElement {
  static styles = css`
  :host {
    display: block;
    width: 100%;
    position: relative;
  }

  .container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background: var(--sl-color-gray-50);
    border: 1px dashed var(--sl-color-gray-200);
    border-radius: var(--sl-border-radius-medium);
    padding: 16px;
    position: relative;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 0px 0px 16px;
  }

  .title {
    margin: 0;
    font-size: 1.5rem;
    color: var(--sl-color-gray-800);
  }

  .menu-trigger {
    position: relative;
    margin-left: 1rem;
    margin-right: 0.5rem;
  }

  sl-icon-button {
    color: var(--sl-color-primary-600);
    font-size: 1.2rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border: 2px solid var(--sl-color-primary-600);
    border-radius: 4px;
    background: none;
    padding: 0.15rem;
    transition: background-color 0.2s ease;
  }

  sl-icon-button:hover {
    background: rgba(37, 99, 235, 0.1);
    border-radius: 4px;
  }

    .empty-state {
      padding: 16px;
    }

    .empty-state sl-icon {
      width: 16px;
      height: 16px;
    }

    .empty-state .title {
      font-weight: bold;
      font-size: 1.2rem;
    }

    .empty-state .instruction {
      display: flex;
      align-items: center;
      gap: 0.3rem;
      white-space: nowrap;
    }

    .empty-state .instruction sl-icon {
      color: var(--sl-color-primary-600);
      border-radius: 4px;
      padding: 0.15rem;
      font-size: 0.8rem;
      vertical-align: middle;
    }

    .empty-state p {
      margin: 0.5rem 0;
      font-size: 1.1rem;
    }

  `;

  @property({ type: String }) title = '';
  @property({ type: Object }) ownerAttrs!: CyOwnerAggregateAttrs;
  @property({ type: Boolean }) canEdit = false;
  @state() private contentSections: ContentSectionAttrs[] = [];
  @state() private isLoading = false;

  protected emptyContentDefaults: { title?: string; body?: string } = {
    title: 'Начните добавлять разделы и контент.',
    body: 'Вы можете добавить свой контент.\n\nКонтент делится на разделы. Каждому разделу можно ограничить доступ или сделать публичным. В разделах можно добавлять различный контент. Контент может быть:\n- Тезисным: короткие карточки с текстовой составляющей.\n- Файловым: можно добавлять чертежи, видео и другие материалы.\n\nКоличество разделов и контента не ограничено, все зависит от вашего'
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this.ownerAttrs) {
      throw new Error(`[${this.constructor.name}] Неверная инициализация компонента`);
    }
    this.loadContentSections();
  }

  async loadContentSections() {
    this.isLoading = true;
    try {
      const result = await this.contentSectionApi.getOwnerArContentSection(this.ownerAttrs.ownerId);
      if (result.isFailure()) {
        this.app.error(
          'Не удалось загрузить пользовательский контент.',
          { ownerAttrs: this.ownerAttrs, result },
        );
        return;
      }
      this.contentSections = result.value.filter(cs => cs.context === this.ownerAttrs.context);
      this.sortContentSections();
    } catch (error) {
      this.app.error(
        'Ошибка при загрузке пользовательского контента.',
        { ownerAttrs: this.ownerAttrs, errMsg: (error as Error).message },
      );
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  private sortContentSections() {
    this.contentSections = [...this.contentSections].sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  private async handleAddContentSection() {
    const modal = document.createElement('add-content-section-modal');
    modal.ownerAttrs = this.ownerAttrs;

    try {
      const newContentSectionId = await modal.show();
      if (!newContentSectionId) return;

      const getResult = await this.contentSectionApi.getContentSection(newContentSectionId);
      if (getResult.isFailure()) {
        this.app.error(`Не удалось создать новый раздел: ${getResult.value}`, { result: getResult });
        return;
      }
      this.contentSections = [...this.contentSections, getResult.value];
      this.sortContentSections();
    } catch (error) {
      console.error('Failed to create thesis set:', error);
      this.app.error('Ошибка при создании раздела.', { error });
    }
  }

  private async handleContentSectionEdited(editedId: string) {
    const getResult = await this.contentSectionApi.getContentSection(editedId, true);
    if (getResult.isFailure()) {
      this.app.error(`[${this.constructor.name}]: Не удалось загрузить данные о разделе.`, {
        id: editedId, result: { status: false, value: getResult.value }
      })
      return;
    }
    const updated = getResult.value;
    this.contentSections = this.contentSections.map(ts => 
      ts.id === updated.id ? updated : ts
    );
    this.sortContentSections();
  }

  private handleContentSectionDelete(deletedId: string) {
    this.contentSections = this.contentSections.filter(ts => ts.id !== deletedId);
  }

  render() {
    if (this.isLoading) {
      return html`<sl-spinner></sl-spinner>`;
    }

    if (!this.canEdit && this.contentSections.length === 0) {
      return html`<div style="display: none"></div>`;
    }

    return html`
      <div class="container">
        ${this.renderHeader()}

        ${this.contentSections.length === 0
          ? this.renderEmptyContainer()
          : this.contentSections.map(contentSection => html`
            <content-section
              .contentSection=${contentSection}
              .canEdit=${this.canEdit}
              @content-section-edited=${(e: CustomEvent<{ id: string }>) => 
                this.handleContentSectionEdited(e.detail.id)}
              @content-section-deleted=${(e: CustomEvent<{id: string}>) => 
                this.handleContentSectionDelete(e.detail.id)}
            ></content-section>
          `)
        }
      </div>
    `;
  }

  protected renderHeader(): TemplateResult {
    return html`
      <div class="header">
        <h2 class="title">${this.title || nothing}</h2>
        ${this.canEdit ? html`
          <div class="menu-trigger">
            <sl-icon-button 
              name="plus-square"
              label="Добавить раздел"
              tabindex="0"
              @click=${this.handleAddContentSection}
              @keydown=${(e: KeyboardEvent) => this.handleKeyAction(e, () => this.handleAddContentSection())}
            ></sl-icon-button>
          </div>
        ` : ''}
      </div>
    `;
  }

  private handleKeyAction(e: KeyboardEvent, action: () => void) {
    if (keyboardUtils.isActionKey(e)) {
      e.preventDefault();
      action();
    }
  }

  protected renderEmptyContainer(): TemplateResult {
    const title = this.emptyContentDefaults?.title ?? 'Пока нет ни одного раздела';
    const body = this.emptyContentDefaults?.body ?? 'Создайте свой первый раздел, чтобы начать добавлять контент используя разметку markdown.';
    return html`
      <div class="empty-state">
        ${markdownUtils.parseWithOptions(title, { class: 'title' })}
        ${markdownUtils.parse(body)}
        <p class="instruction">Чтобы добавить раздел нажмите кнопку: <sl-icon name="plus-square"></sl-icon> на правом верхнем углу</p>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'content-container': ContentContainer;
  }
}
