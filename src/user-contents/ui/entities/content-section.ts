import { html, css, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { BaseElement } from '#app/ui/base/base-element';
import type { ContentSectionAttrs } from '#user-contents/domain/section/struct/attrs';
import type { ContentTypes, UserContent } from '#user-contents/domain/content/meta';
import { ContentComponentManager } from '#user-contents/ui/content-component-manager'; // Импортируем менеджер
import type { CyOwnerAggregateAttrs } from '#app/domain/types';

@customElement('content-section')
export class ContentSection extends BaseElement {
  static styles = css`
    :host {
      display: block;
      background: var(--sl-color-white);
      border: 1px solid var(--sl-color-gray-200);
      border-radius: var(--sl-border-radius-medium);
      box-shadow: var(--sl-shadow-x-small);
      padding: 1.5rem;
      margin-bottom: 2rem;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .title-container {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .title {
      font-size: 1.4rem;
      font-weight: 600;
      margin: 0;
    }

    .theses-container {
      display: grid;
      gap: 1.5rem;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
    }

    .action-btn {
      --sl-button-font-size-small: 0.8rem;
      --sl-button-padding-small: 0.3rem 0.5rem;
    }

    @media (min-width: 768px) {
      .theses-container {
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      }
    }
  `;

  @property({ type: Object }) contentSection!: ContentSectionAttrs;
  @property({ type: Boolean }) canEdit = false;

  @state() sectionContents: UserContent[] = [];
  protected isLoading = false;

  // Создаем экземпляр менеджера. Поскольку он без состояния, его можно создать один раз.
  private contentComponentManager = new ContentComponentManager();

  protected lastUsedIcon: ContentTypes = 'THESIS';

  connectedCallback(): void {
    super.connectedCallback();
    this.loadContents();
  }

  protected async loadContents(forceRefresh?: boolean): Promise<void> {
    const getResult = await this.userContentApi.getSectionContens(this.contentSection.id, forceRefresh);
    if (getResult.isFailure()) {
      this.app.error(
        `[${this.constructor.name}]: Не удалось загрузить данные контентов.`,
        { contentSection: this.contentSection, result: getResult.value }
      );
      return;
    }
    this.sectionContents = [...getResult.value];
    this.sortContents();
  }

  private sortContents() {
    this.sectionContents = [...this.sectionContents].sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  private async dispatchEditedEvent(): Promise<void> {
    const event: CustomEvent<{ id: string }> = new CustomEvent(
      'content-section-edited', { detail: { id: this.contentSection.id } }
    );
    this.dispatchEvent(event);
  }

  private async handleEditContentSection() {
    const modal = document.createElement('content-section-edit-modal');

    try {
      const result = await modal.show(this.contentSection);
      if (result) {
        this.dispatchEditedEvent();
      }
    } catch (err) {
      this.app.error('Ошибка при обновлении раздела.');
    }
  }

  private async handleDeleteContentSection() {
    const confirmed = await this.app.showDialog({
      title: 'Удаление раздела',
      content: 'Вы уверены, что хотите удалить этот раздел? Все тезисы внутри также будут удалены.',
      confirmVariant: 'danger',
      confirmText: 'Удалить',
      cancelText: 'Отмена',
    });
    if (!confirmed) return;

    const deleteResult = await this.contentSectionApi.deleteContentSection(this.contentSection.id);
    if (deleteResult.isFailure()) {
      this.app.error(
        'Не удалось удалить раздел.',
        { id: this.contentSection.id, result: deleteResult.value }
      );
      return;
    }
    this.app.info('Раздел успешно удален.');

    this.dispatchEvent(new CustomEvent('content-section-deleted', {
      detail: { id: this.contentSection.id },
    }));
  }

  /** Добавление нового контента. Модальное окно рендерится менеджером контентов. */
  private async handleAddByType(type: ContentTypes) {
    try {
      this.lastUsedIcon = type;
      this.isLoading = true;
      const ownerAttrs: CyOwnerAggregateAttrs = {
        ownerId: this.contentSection.ownerId,
        ownerName: this.contentSection.ownerId,
        access: this.contentSection.access,
        context: this.contentSection.context,
      }
      const modal = this.contentComponentManager.getAddContentModal(type)
      const result = await modal.show(this.contentSection.id, ownerAttrs);
      if (result) {
        this.loadContents(true);
      }
    } catch (error) {
      this.app.error(`[${this.constructor.name}]: Ошибка при добавлении контента.`, { error });
    } finally {
      this.isLoading = false;
    }
  }

  render() {
    const { title, icon } = this.contentSection;
    const ownerAttrs: CyOwnerAggregateAttrs = {
      ownerId: this.contentSection.ownerId,
      ownerName: this.contentSection.ownerName,
      access: this.contentSection.access,
      context: this.contentSection.context,
    }

    return html`
      <div class="content-section">
        <div class="header">
          <div class="title-container">
            ${icon ? html`<sl-icon name=${icon}></sl-icon>` : ''}
            <h2 class="title">${title}</h2>
          </div>

          ${this.canEdit ? html`
            <div class="actions">
              ${this.renderButtons()}
            </div>
          ` : ''}
        </div>

        ${this.sectionContents.length > 0 ? html`
          <div class="theses-container">
            ${this.sectionContents.map(content =>
              this.contentComponentManager.renderContent(
                content,
                ownerAttrs,
                this.canEdit,
                this.loadContents.bind(this),
              )
            )}
          </div>
        ` : ''}
      </div>
    `;
  }

  protected renderButtons(): TemplateResult {
    return html`
      ${this.contentComponentManager.renderAddContentControls(
        this.lastUsedIcon,
        this.handleAddByType.bind(this),
      )}
      <sl-tooltip content="Редактировать раздел" placement="bottom">
        <sl-button
          class="action-btn"
          size="small"
          @click=${this.handleEditContentSection}
          @contextmenu=${(e: Event) => e.preventDefault()}
        >
          <sl-icon name="pencil"></sl-icon>
        </sl-button>
      </sl-tooltip>
      <sl-tooltip content="Удалить раздел" placement="bottom">
        <sl-button
          class="action-btn"
          size="small"
          variant="danger"
          @click=${this.handleDeleteContentSection}
          @contextmenu=${(e: Event) => e.preventDefault()}
        >
          <sl-icon name="trash"></sl-icon>
        </sl-button>
      </sl-tooltip>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'content-section': ContentSection;
  }
}
