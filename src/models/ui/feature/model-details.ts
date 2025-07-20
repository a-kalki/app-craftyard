import { html, css, nothing, type TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { ModelPolicy } from '#models/domain/policy';
import type { ModelAttrs, ModelContentContextTypes } from '#models/domain/struct/attrs';
import { BaseElement } from '#app/ui/base/base-element';
import { SKILL_LEVEL_TITLES } from '#app/domain/constants';
import { MODEL_CATEGORY_TITLES } from '#models/domain/struct/constants';
import type { ModelArMeta } from '#models/domain/meta';
import { costUtils } from '#app/domain/utils/cost/cost-utils';
import type { ContentSectionAttrs } from '#user-contents/domain/section/struct/attrs';
import type { CyOwnerAggregateAttrs } from '#app/domain/types';
import { WorkshopPolicy } from '#workshop/domain/policy';
import { OfferModalManager } from '#offer/ui/offer-modal-manager';
import type { OfferAttrs, OfferTypes } from '#offer/domain/types';
import type { ModelOfferAttrs } from '#offer/domain/base-offer/struct/attrs';
import { offersData } from '#offer/domain/constants';
import type { UserAttrs } from '#app/domain/user/struct/attrs';

@customElement('model-details')
export class ModelDetails extends BaseElement {
  static styles = css`
    :host {
      display: block;
      height: 100%;
      width: 100%;
      overflow-y: auto;
      padding: 16px;
      box-sizing: border-box;
    }

    .model-details-container {
      max-width: 800px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--sl-color-neutral-200);
    }

    .title {
      font-size: 1.8rem;
      font-weight: 700;
    }

    .main-section {
      margin-bottom: 2rem;
    }

    .description {
      margin-bottom: 1.5rem;
      font-size: 1.1rem;
      line-height: 1.6;
    }

    .middle {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
      margin-bottom: 2rem;
    }

    @media (min-width: 600px) {
      .middle {
        grid-template-columns: 1fr 1fr;
      }
    }

    .column h4 {
      margin-bottom: 0.5rem;
      font-size: 1.1rem;
    }

    ul {
      padding-left: 1.2rem;
      margin: 0;
    }

    li {
      margin-bottom: 0.25rem;
    }

    .model-owner-section {
      margin-top: 32px;
      margin-bottom: 24px;
    }

    sl-spinner {
      display: block;
      margin: 50px auto;
      font-size: 2.5rem;
    }
  `;

  @state() modelId: string;
  @state() private model: ModelAttrs | null = null;
  @state() private modelOffers: OfferAttrs[] | null = null;
  @state() private canEditModel = false;
  @state() private modelOwner: UserAttrs | null = null;
  @state() private isLoading = true;

  constructor() {
    super();
    this.modelId = this.app.router.getParams().modelId;
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadModelDetails();
  }

  private async loadModelDetails() {
    this.isLoading = true;
    try {
      const modelResult = await this.modelApi.getModel(this.modelId);
      if (modelResult.isFailure()) {
        this.app.error('Не удалось загрузить модель', { result: modelResult.value, modelId: this.modelId });
        this.isLoading = false;
        return;
      }
      this.model = modelResult.value;

      const userInfo = this.app.user;
      if (userInfo.isAuth) {
        this.canEditModel = new ModelPolicy(userInfo.attrs, this.model).canEdit();
      }

      const modelOwnerResult = await this.userApi.getUser(this.model.ownerId);
      if (modelOwnerResult.isFailure()) {
        this.app.error(
          'Не удалось загрузить информацию о конструкторе модели',
          { result: modelOwnerResult.value, ownerId: this.model.ownerId }
        );
        this.modelOwner = null;
      } else {
        this.modelOwner = modelOwnerResult.value;
      }

      const user = this.app.user.isAuth && this.app.user.attrs;
      if (user) {
        const offersResult = await this.offerApi.getModelOffers(this.model!.id);
        if (offersResult.isSuccess()) {
          this.modelOffers = offersResult.value.filter(offer => (offer as ModelOfferAttrs).masterId === user.id);
        } else {
          this.app.error(
            'Не удалось загрузить предложения для модели',
            { result: offersResult.value, modelId: this.model.id }
          );
          this.modelOffers = [];
        }
      }
    } catch (error) {
      this.app.error('Произошла непредвиденная ошибка при загрузке деталей модели', { error });
    } finally {
      this.isLoading = false;
    }
  }

  private handleAddImages(event: CustomEvent<string[]>) {
    this.modelApi.addModelImages(this.modelId, event.detail)
      .then(result => {
        if (result.isFailure()) {
          this.app.error('Ошибка обновления модели с новыми изображениями', {
            result,
            ids: event.detail
          });
        } else {
          this.model = {
            ...this.model!,
            imageIds: [...this.model!.imageIds, ...event.detail]
          };
          this.requestUpdate();
        }
      });
  }

  private handleRemoveImage(event: CustomEvent<string>) {
    this.modelApi.deleteImage(this.modelId, event.detail)
      .then(result => {
        if (result.isFailure()) {
          this.app.error('Ошибка удаления изображения', {
            result,
            id: event.detail
          });
        } else {
          this.model = {
            ...this.model!,
            imageIds: this.model!.imageIds.filter(id => id !== event.detail)
          };
          this.requestUpdate();
        }
      });
  }

  private async handleReorderImages(event: CustomEvent<string[]>) {
    const pendingReorder = event.detail;
    const result = await this.modelApi.reorderModelImages(this.modelId, pendingReorder!);
    if (result.isFailure()) {
      this.app.error('Ошибка изменения порядка изображений', {
        result,
        ids: pendingReorder
      });
      return;
    }
    this.model = {
      ...this.model!,
      imageIds: [...pendingReorder]
    };
    this.requestUpdate();
  }

  private async openEditModelModal() {
    const modal = document.createElement('edit-model-modal');

    const result = await modal.show(this.model!);
    if (result) {
      await this.loadModelDetails();
    }
  }

  protected async addOffer(type: Exclude<OfferTypes, 'WORKSPACE_RENT_OFFER'>): Promise<void> {
    if (!this.canAddOffer(type)) {
      this.app.error('Вы не можете добавлять "Офферы" для данной модели');
      return;
    }
    const modal = new OfferModalManager().getAddOfferModal(type);
    const result = await modal.show(type, this.model!);
    if (result) {
      await this.loadModelDetails();
    }
  }

  protected getWorkshopPolicy(): WorkshopPolicy | undefined {
    const user = this.app.user;
    if (!user.isAuth) return;
    const workshop = this.app.userWorkshop;
    if (!workshop.isBind) return;
    return new WorkshopPolicy(user.attrs, workshop.workshop);
  }

  protected haveOffer(type: Exclude<OfferTypes, 'WORKSPACE_RENT_OFFER'>): boolean {
    return !!this.modelOffers && this.modelOffers
      .filter(offer => offer.type === type)
      .length > 0
  }

  protected canAddOffer(type: Exclude<OfferTypes, 'WORKSPACE_RENT_OFFER'>): boolean {
    const policy = this.getWorkshopPolicy();
    return type === 'COURSE_OFFER'
      ? (!!policy && policy.isMentor() && !this.haveOffer(type))
      : (!!policy && policy.isMaster() && !this.haveOffer(type))
  }

  render() {
    if (this.isLoading) {
      return html`
        <sl-spinner label="Загрузка модели..."></sl-spinner>
      `;
    }

    if (!this.model) {
      return html`
        <div class="error-message">Модель не найдена или произошла ошибка загрузки.</div>
      `;
    }

    const ownerName: ModelArMeta['name'] = 'ModelAr';
    const access: ContentSectionAttrs['access'] = 'public';
    const context: ModelContentContextTypes = 'model-info';
    const ownerAttrs: CyOwnerAggregateAttrs = {
      ownerId: this.model.id,
      context,
      ownerName,
      access
    };
    const modelPolicy = new ModelPolicy(this.app.getState().currentUser, this.model);

    return html`
      <div class="model-details-container">
        ${this.renderHeader()}

        <model-images
          .ownerAttrs=${ownerAttrs}
          .imageIds=${this.model.imageIds}
          .canEdit=${this.canEditModel}
          @addImages=${this.handleAddImages}
          @deleteImage=${this.handleRemoveImage}
          @reorderImages=${this.handleReorderImages}
        ></model-images>

        <div class="main-section">
          <p class="description">${this.model.description}</p>
          <div class="middle">
            <div>
              <strong>Категория:</strong><br>
              ${this.model.categories.map(cat => html`
                <sl-tag size="small" variant="primary">${MODEL_CATEGORY_TITLES[cat]}</sl-tag>
              `)}<br><br>
              <strong>Уровень:</strong><br>
              <sl-tag size="small" variant="warning">${SKILL_LEVEL_TITLES[this.model.difficultyLevel]}</sl-tag>
            </div>
            <div>
              <strong>Время изготовления:</strong><br>
              <sl-tag size="small" variant="neutral">${this.model.estimatedTime}</sl-tag><br><br>
              <strong>Цена за доступ:</strong><br>
              <sl-tag size="small" variant="success">${costUtils.toString(this.model.cost)}</sl-tag>
            </div>
          </div>
        </div>

        ${this.modelOwner ? html`
          <hr>
          <div class="model-owner-section">
            <user-info-card .user=${this.modelOwner} title="О Конструкторе Модели"></user-info-card>
          </div>
        ` : nothing}

        <content-container
          .ownerAttrs=${ownerAttrs}
          .canEdit=${modelPolicy.canEditUserContent(ownerAttrs)}
        ></content-container>

      </div>
    `;
  }

  protected renderHeader(): TemplateResult {
    const availableActions: {
      type: 'edit-model' | 'add-hobby-kit-offer' | 'add-product-sale-offer' | 'add-course-offer';
      label: string;
      icon: string;
      handler: () => void;
    }[] = [];

    if (this.canEditModel) {
      availableActions.push({
        type: 'edit-model',
        label: 'Редактировать модель',
        icon: 'pencil',
        handler: this.openEditModelModal,
      });
    }
    if (this.canAddOffer('HOBBY_KIT_OFFER')) {
      availableActions.push({
        type: 'add-hobby-kit-offer',
        label: `Добавить оффер ${offersData.HOBBY_KIT_OFFER.title}`,
        icon: offersData.HOBBY_KIT_OFFER.icon,
        handler: () => this.addOffer('HOBBY_KIT_OFFER'),
      });
    }
    if (this.canAddOffer('PRODUCT_SALE_OFFER')) {
      availableActions.push({
        type: 'add-product-sale-offer',
        label: `Добавить оффер ${offersData.PRODUCT_SALE_OFFER.title}`,
        icon: offersData.PRODUCT_SALE_OFFER.icon,
        handler: () => this.addOffer('PRODUCT_SALE_OFFER'),
      });
    }
    if (this.canAddOffer('COURSE_OFFER')) {
      availableActions.push({
        type: 'add-course-offer',
        label: `Добавить оффер ${offersData.COURSE_OFFER.title}`,
        icon: offersData.COURSE_OFFER.icon,
        handler: () => this.addOffer('COURSE_OFFER'),
      });
    }

    if (availableActions.length === 0) {
      return html`
        <div class="section-header"> <h2>${this.model?.title || 'Описание модели'}</h2> </div>
      `;
    }

    if (availableActions.length === 1) {
      const action = availableActions[0];
      return html`
        <div class="section-header">
          <h2>${this.model?.title || 'Описание модели'}</h2>
          <sl-button-group>
            <sl-button
              size="small"
              variant="primary"
              @click=${action.handler}
            >
              <sl-icon slot="prefix" name=${action.icon}></sl-icon>
            </sl-button>
          </sl-button-group>
        </div>
      `;
    }

    const mainAction = availableActions[0];
    const otherActions = availableActions.slice(1);

    return html`
      <div class="section-header">
        <h2>${this.model?.title || 'Описание модели'}</h2>
        <sl-button-group>
          <sl-button
            size="small"
            variant="primary"
            @click=${mainAction.handler}
          >
            <sl-icon slot="prefix" name=${mainAction.icon}></sl-icon>
          </sl-button>

          <sl-dropdown placement="bottom-end" hoist>
            <sl-button size="small" slot="trigger" variant="primary" caret> </sl-button>
            <sl-menu>
              ${otherActions.map(action => html`
                <sl-menu-item @click=${action.handler}>
                  <sl-icon slot="prefix" name=${action.icon}></sl-icon>
                  ${action.label}
                </sl-menu-item>
              `)}
            </sl-menu>
          </sl-dropdown>
        </sl-button-group>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'model-details': ModelDetails;
  }
}
