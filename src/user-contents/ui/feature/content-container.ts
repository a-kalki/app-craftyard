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

    .main-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      background: var(--sl-color-gray-50);
      border: 1px dashed var(--sl-color-gray-200);
      border-radius: var(--sl-border-radius-medium);
      padding: 16px;
    }

    .header-and-tabs-wrapper {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .tabs-and-button-row {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0 0 0 1rem;
      margin: 0 -16px;
      background-color: var(--sl-color-neutral-0);
      border-bottom: 1px solid var(--sl-color-neutral-200);
    }

    sl-tab-group {
      flex-grow: 1;
      margin-bottom: 0;
      --track-color: transparent;
      --indicator-color: var(--sl-color-primary-600);
      --indicator-border-radius: 0;
      --active-tab-color: var(--sl-color-primary-600);
      --inactive-tab-color: var(--sl-color-neutral-600);
      --focus-ring-width: 0;
    }

    sl-tab-panel {
      padding: 1rem 0;
    }

    .section-title {
      margin: 0;
      font-size: 1.5rem;
      color: var(--sl-color-gray-800);
    }

    .add-section-button sl-icon-button {
      flex-shrink: 0;
      color: var(--sl-color-primary-600);
      font-size: 1.2rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: 4px;
      background: none;
      padding: 0.15rem;
      transition: background-color 0.2s ease;
      margin-right: 20px;
    }

    .add-section-button sl-icon-button:hover {
      background: rgba(37, 99, 235, 0.1);
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

  @property({ type: String }) title = ''; // Свойство для заголовка
  @property({ type: Object }) ownerAttrs!: CyOwnerAggregateAttrs;
  @property({ type: Boolean }) canEdit = false;
  @state() private contentSections: ContentSectionAttrs[] = [];
  @state() private isLoading = false;
  @state() private activeSectionId: string = '';

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
      if (this.contentSections.length > 0 && !this.activeSectionId) {
          this.activeSectionId = this.contentSections[0].id;
      }
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
      this.activeSectionId = getResult.value.id;
    } catch (error) {
      console.error('Failed to create content section:', error);
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
    if (this.activeSectionId === deletedId) {
      this.activeSectionId = this.contentSections.length > 0 ? this.contentSections[0].id : '';
    }
  }

  private handleTabShow(event: CustomEvent) {
    this.activeSectionId = event.detail.name;
  }

  private handleKeyAction(e: KeyboardEvent, action: () => void) {
    if (keyboardUtils.isActionKey(e)) {
      e.preventDefault();
      action();
    }
  }

  render() {
    if (this.isLoading) {
      return html`<sl-spinner></sl-spinner>`;
    }

    if (!this.canEdit && this.contentSections.length === 0) {
      return html`<div style="display: none"></div>`;
    }

    return html`
      <div class="main-container">
        ${this.renderHeaderAndTabs()}

        ${this.contentSections.length === 0
          ? this.renderEmptyContainer()
          : html`
            ${this.contentSections.map(contentSection => html`
              <sl-tab-panel name=${contentSection.id} ?active=${this.activeSectionId === contentSection.id}>
                <content-section
                  .contentSection=${contentSection}
                  .canEdit=${this.canEdit}
                  @content-section-edited=${(e: CustomEvent<{ id: string }>) =>
                    this.handleContentSectionEdited(e.detail.id)}
                  @content-section-deleted=${(e: CustomEvent<{id: string}>) =>
                    this.handleContentSectionDelete(e.detail.id)}
                ></content-section>
              </sl-tab-panel>
            `)}
          `
        }
      </div>
    `;
  }

  protected renderHeaderAndTabs(): TemplateResult {
    return html`
      <div class="header-and-tabs-wrapper">
        ${this.title ? html`<h2 class="section-title">${this.title}</h2>` : nothing}
        <div class="tabs-and-button-row">
          <sl-tab-group @sl-tab-show=${this.handleTabShow} active-tab=${this.activeSectionId}>
            ${this.contentSections.map(contentSection => html`
              <sl-tab slot="nav" panel=${contentSection.id} ?active=${this.activeSectionId === contentSection.id}>
                ${contentSection.title}
              </sl-tab>
            `)}
          </sl-tab-group>
          ${this.canEdit ? html`
            <div class="add-section-button">
              <sl-icon-button 
                name="plus-square"
                label="Добавить раздел"
                tabindex="0"
                @click=${this.handleAddContentSection}
                @keydown=${(e: KeyboardEvent) => this.handleKeyAction(e, () => this.handleAddContentSection())}
              ></sl-icon-button>
            </div>
          ` : nothing}
        </div>
      </div>
    `;
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
