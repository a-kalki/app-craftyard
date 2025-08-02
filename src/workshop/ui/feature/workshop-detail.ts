import { html, css, type TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { BaseElement } from '../../../app/ui/base/base-element';
import type { WorkshopAttrs } from '#workshop/domain/struct/attrs';
import type { CyOwnerAggregateAttrs } from '#app/core/types';
import type { WorkshopArMeta } from '#workshop/domain/meta';
import { WorkshopPolicy } from '#workshop/domain/policy';
import { markdownUtils } from '#app/ui/utils/markdown';

@customElement('workshop-details')
export class WorkshopDetailsFeature extends BaseElement {
  static styles = css`
    :host {
      display: block;
      height: 100%;
      width: 100%;
    }

    .workshop-page-container {
      max-width: 1000px;
      margin: 8px auto;
      background: var(--sl-color-neutral-0);
      border-radius: var(--sl-border-radius-medium);
      box-shadow: var(--sl-shadow-large);
      
      height: calc(100% - 16px);
      overflow-y: auto;
      display: flex;
      flex-direction: column;
    }

    .sticky-workshop-header {
      position: sticky;
      top: 0;
      z-index: 20;
      background-color: var(--sl-color-neutral-0);
      border-bottom: 1px solid var(--sl-color-neutral-200);
    }

    .content-sections-wrapper {
      flex-grow: 1;
    }

    .tabs-and-button-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 0 16px 16px;
      background-color: var(--sl-color-neutral-0);
    }

    .tabs-wrapper {
      flex-grow: 1;
      min-width: 0;
    }

    .tabs-wrapper sl-tab-group {
      --track-color: transparent;
      --indicator-color: var(--sl-color-primary-600);
      --indicator-border-radius: 0;
      --active-tab-color: var(--sl-color-primary-600);
      --inactive-tab-color: var(--sl-color-neutral-600);
      --focus-ring-width: 0;
      padding-left: 1rem;
      margin-left: -1rem;
    }

    .add-section-button sl-icon-button {
      flex-shrink: 0;
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
      margin-right: 0;
    }

    .add-section-button sl-icon-button:hover {
      background: rgba(37, 99, 235, 0.1);
    }

    /* Медиа-запросы для мобильных устройств */
    @media (max-width: 768px) {
      :host {
        padding-top: 24px;
      }

      .workshop-page-container {
        height: calc(100% - 16px);
      }

      .tabs-and-button-row {
        flex-direction: row;
        align-items: center;
        padding: 0 12px 12px;
      }
      .tabs-wrapper sl-tab-group {
        padding-left: 0;
        margin-left: 0;
      }
    }
  `;

  @state()
  protected workshop: WorkshopAttrs | null = null;
  @state()
  protected canEdit = false;

  @state() private contentSections: any[] = [];
  @state() private activeSectionId: string = '';

  async connectedCallback() {
    super.connectedCallback();
    this.loadWorkshop();
  }

  protected getWorkshopId(): string {
    return this.app.router.getParams().workshopId;
  }

  private async loadWorkshop(): Promise<void> {
    const workshopId = this.getWorkshopId();
    const getResult = await this.workshopApi.getWorkshop(workshopId);
    if (getResult.isFailure()) {
      this.app.error('Не удалось загрузить данные мастерской', {
        workshopId,
        description: 'Мастерской с таким id не существует'
      });
      return;
    }

    this.workshop = getResult.value;
    const userInfo = this.app.userInfo;
    if (userInfo.isAuth) {
      const policy = new WorkshopPolicy(
        userInfo.user,
        this.workshop,
      );
      this.canEdit = policy.canEdit();
    }
    await this.loadContentSections();
  }

  private async loadContentSections(): Promise<void> {
    if (!this.workshop) return;
    const ownerAttrs = this.getOwnerAttrs();
    try {
      const result = await this.contentSectionApi.getOwnerArContentSection(ownerAttrs.ownerId);
      if (result.isFailure()) {
        this.app.error(
          'Не удалось загрузить пользовательский контент для мастерской.',
          { details: { ownerAttrs, result: result.value } },
        );
        return;
      }
      this.contentSections = result.value.filter((cs: any) => cs.context === ownerAttrs.context);
      this.sortContentSections();
      if (this.contentSections.length > 0 && !this.activeSectionId) {
          this.activeSectionId = this.contentSections[0].id;
      }
    } catch (error) {
      this.app.error(
        'Ошибка при загрузке пользовательского контента для мастерской.',
        { details: { ownerAttrs, errMsg: (error as Error).message } },
      );
    }
  }

  private sortContentSections() {
    this.contentSections = [...this.contentSections].sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  private async handleAddContentSectionFromWorkshop(): Promise<void> {
      const modal = document.createElement('add-content-section-modal');
      modal.ownerAttrs = this.getOwnerAttrs();

      try {
        const newContentSectionId = await modal.show();
        if (!newContentSectionId) return;

        const getResult = await this.contentSectionApi.getContentSection(newContentSectionId);
        if (getResult.isFailure()) {
          this.app.error(
            `Не удалось создать новый раздел: ${getResult.value}`,
            { details: { result: getResult.value } }
          );
          return;
        }
        this.contentSections = [...this.contentSections, getResult.value];
        this.sortContentSections();
        this.activeSectionId = getResult.value.id;
      } catch (error) {
        console.error('Failed to create content section:', error);
        this.app.error('Ошибка при создании раздела.', { details: { error } });
      }
  }

  private async handleContentSectionEdited(editedId: string) {
    alert('Не реализовано');
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

  render() {
    if (!this.workshop) {
      return html`
        <div class="workshop-page-container">
          <div class="content-sections-wrapper" style="text-align: center; padding: 20px;">
            <sl-spinner style="width:48px; height:48px; display: inline-block;" label="Загрузка мастерской..."></sl-spinner>
          </div>
        </div>
      `;
    }
    return html`
      <div class="workshop-page-container">
        <div class="sticky-workshop-header">
          <workshop-header
            .workshop=${this.workshop}
            activePage="details"
            .canEdit=${this.canEdit}
          ></workshop-header>
          ${this.renderTabsAndAddSectionButton()}
        </div>
        <div class="content-sections-wrapper">
          ${this.renderContentSections()}
        </div>
      </div>
    `;
  }

  protected renderTabsAndAddSectionButton(): TemplateResult {
    return html`
      <div class="tabs-and-button-row">
        <div class="tabs-wrapper">
          <sl-tab-group @sl-tab-show=${this.handleTabShow} active-tab=${this.activeSectionId}>
            ${this.contentSections.map(contentSection => html`
              <sl-tab slot="nav" panel=${contentSection.id} ?active=${this.activeSectionId === contentSection.id}>
                ${contentSection.title}
              </sl-tab>
            `)}
          </sl-tab-group>
        </div>
        ${this.canEdit ? html`
          <div class="add-section-button">
            <sl-tooltip content="Добавить раздел" placement="left">
              <sl-icon-button 
                name="plus-square"
                label="Добавить раздел"
                tabindex="0"
                @click=${this.handleAddContentSectionFromWorkshop}
              ></sl-icon-button>
            </sl-tooltip>
          </div>
        ` : ''}
      </div>
    `;
  }

  protected getOwnerAttrs(): CyOwnerAggregateAttrs {
    const ownerName: WorkshopArMeta['name'] = 'WorkshopAr';
    return {
      ownerId: this.workshop!.id,
      ownerName,
      access: 'public',
      context: 'workshop-info',
    };
  }

  protected renderContentSections(): TemplateResult {
    if (this.contentSections.length === 0 && !this.canEdit) {
      return html`<div style="display: none"></div>`;
    }

    if (this.contentSections.length === 0) {
      return this.renderEmptyContentContainerState();
    }

    return html`
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
    `;
  }

  private renderEmptyContentContainerState(): TemplateResult {
    const title = 'Начните добавлять разделы и контент.';
    const body = 'Вы можете добавить свой контент.\n\nКонтент делится на разделы. Каждому разделу можно ограничить доступ или сделать публичным. В разделах можно добавлять различный контент. Контент может быть:\n- Тезисным: короткие карточки с текстовой составляющей.\n- Файловым: можно добавлять чертежи, видео и другие материалы.\n\nКоличество разделов и контента не ограничено, все зависит от вашего';
    return html`
      <div class="empty-state" style="padding: 20px;">
        ${markdownUtils.parseWithOptions(title, { class: 'title' })}
        ${markdownUtils.parse(body)}
        <p class="instruction">Чтобы добавить раздел нажмите кнопку: <sl-icon name="plus-square"></sl-icon> на правом верхнем углу</p>
      </div>
    `;
  }
}
