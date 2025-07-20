import { html, css, nothing, type TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { BaseElement } from '#app/ui/base/base-element';
import type { ExpenseItem, OfferStatus } from '#offer/domain/base-offer/struct/attrs';
import type { UserAttrs } from '#app/domain/user/struct/attrs';
import type { ModelAttrs, ModelCategory } from '#models/domain/struct/attrs';
import { costUtils } from '#app/domain/utils/cost/cost-utils';
import { markdownUtils } from '#app/ui/utils/markdown';
import type { OfferAttrs } from '#offer/domain/types';
import { OfferPolicy } from '#offer/domain/policy';

import type { CourseOfferAttrs } from '#offer/domain/course/struct/attrs';
import type { HobbyKitOfferAttrs } from '#offer/domain/hobby-kit/struct/attrs';
import type { ProductSaleOfferAttrs } from '#offer/domain/product-sale/struct/attrs';
import { SKILL_LEVEL_TITLES } from '#app/domain/constants';
import { MODEL_CATEGORY_TITLES } from '#models/domain/struct/constants';
import { WorkshopPolicy } from '#workshop/domain/policy';
import type { WorkspaceRentOfferAttrs } from '#offer/domain/workspace-rent/struct/attrs';

@customElement('offer-details')
export class OfferDetails extends BaseElement {
  static styles = css`
    :host {
      display: block;
      height: 100%;
      width: 100%;
      overflow-y: auto;
      padding: 16px;
      box-sizing: border-box;
      background-color: var(--sl-color-neutral-50);
    }

    .offer-details-container {
      max-width: 900px;
      margin: 0 auto;
      background-color: var(--sl-color-neutral-0);
      border-radius: var(--sl-border-radius-medium);
      box-shadow: var(--sl-shadow-medium);
      padding: 24px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
    }

    .offer-title {
      font-size: 2.2rem;
      font-weight: 700;
      color: var(--sl-color-primary-800);
      margin: 0;
      line-height: 1.2;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 32px;
      margin-bottom: 24px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--sl-color-neutral-200);
    }

    .section-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--sl-color-neutral-800);
      margin: 0;
    }

    /* Styles for sl-button-group to ensure consistent sizing */
    sl-button-group sl-button,
    sl-button-group sl-dropdown::part(trigger) {
      --button-size: 36px;
      height: var(--button-size);
      min-width: var(--button-size);
      min-height: var(--button-size);
      padding: 0; /* Remove default padding as icon fills */
      display: flex;
      align-items: center;
      justify-content: center;
    }

    sl-button-group sl-button sl-icon,
    sl-button-group sl-dropdown::part(trigger) sl-icon {
      font-size: 1.2em;
    }

    /* Override Shoelace's default for dropdown trigger in a group */
    sl-button-group sl-dropdown::part(trigger) {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        /* Убрана строка border-left, которая добавляла лишнюю границу - Эта правка уже была */
    }

    /* Offer main content split into two vertical sectors */
    .offer-main-content {
      display: flex;
      flex-direction: column; /* Stack on small screens */
      gap: 24px; /* Space between the two independently contoured blocks */
      margin-bottom: 24px;
    }

    @media (min-width: 768px) {
      .offer-main-content {
        flex-direction: row; /* Side-by-side on larger screens */
      }
    }

    .offer-description-sector,
    .offer-details-sector {
      padding: 20px;
      border-radius: var(--sl-border-radius-medium);
      box-shadow: var(--sl-shadow-x-small); /* Light shadow for contour */
      background-color: var(--sl-color-neutral-0); /* White background for contour */
      border: 1px solid var(--sl-color-neutral-200); /* Light border for contour */
    }

    .offer-description-sector {
      flex: 2; /* 2/3 width */
      font-size: 1.1rem;
      line-height: 1.6;
      color: var(--sl-color-neutral-700);
      /* Точечные изменения для переноса длинных слов/строк */
      word-break: break-word; /* Позволяет переносить слова внутри блока */
      overflow-wrap: break-word; /* Еще одно свойство для переноса длинных слов */
    }

    .offer-details-sector {
      flex: 1; /* 1/3 width */
      display: flex;
      flex-direction: column;
      gap: 16px; /* Space between price/duration and specific details */
    }

    .price-tag {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--sl-color-success-700);
      white-space: nowrap;
    }

    .duration-text {
      font-size: 1rem;
      font-weight: 500;
      color: var(--sl-color-neutral-700);
      white-space: nowrap;
    }

    .offer-details-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
    }

    @media (min-width: 480px) {
      .offer-details-grid {
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      }
    }

    .detail-item strong {
      display: inline;
      color: var(--sl-color-neutral-900);
      font-size: 0.95rem;
      margin-right: 5px;
    }
    .detail-item span {
      color: var(--sl-color-neutral-700);
      font-size: 1rem;
      white-space: nowrap; /* Восстановлено white-space: nowrap; */
    }

    .expense-list {
      margin-top: 24px;
      margin-bottom: 24px;
      background-color: var(--sl-color-neutral-50);
      border-radius: var(--sl-border-radius-medium);
      padding: 16px;
      border: 1px dashed var(--sl-color-neutral-200);
    }
    .expense-list h3 {
      font-size: 1.2rem;
      color: var(--sl-color-neutral-800);
      margin-top: 0;
      margin-bottom: 10px;
    }
    .expense-list ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .expense-list li {
      margin-bottom: 8px;
      color: var(--sl-color-neutral-700);
    }
    .expense-list li strong {
      color: var(--sl-color-neutral-900);
      margin-right: 5px;
    }

    .model-info-section {
      margin-top: 32px;
    }
    .model-info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 16px 20px;
      margin-bottom: 24px;
    }
    .model-info-grid .detail-item {
      margin-bottom: 0;
    }

    .model-owner-info {
        margin-top: 20px;
        padding-top: 15px;
        border-top: 1px dashed var(--sl-color-neutral-200);
        font-size: 1rem;
        color: var(--sl-color-neutral-700);
    }
    .model-info-section .detail-item span {
      white-space: normal;
      word-break: break-word;
      overflow-wrap: break-word;
    }

    sl-spinner {
      display: block;
      margin: 50px auto;
      font-size: 2.5rem;
    }

    .error-message {
      text-align: center;
      color: var(--sl-color-danger-500);
      font-size: 1.1rem;
      padding: 20px;
    }

    .info-message {
      text-align: center;
      color: var(--sl-color-primary-500);
      font-size: 1.1rem;
      padding: 20px;
      margin-top: 20px;
      border: 1px solid var(--sl-color-primary-200);
      border-radius: var(--sl-border-radius-medium);
      background-color: var(--sl-color-primary-50);
    }
  `;

  @state() offerId: string;
  @state() protected offer: Exclude<OfferAttrs, WorkspaceRentOfferAttrs> | null = null;
  @state() protected master: UserAttrs | null = null;
  @state() protected model: ModelAttrs | null = null;
  @state() protected modelOwner: UserAttrs | null = null;
  @state() protected isLoading = true;
  @state() protected hasError = false;
  @state() protected isRentOfferError = false;
  @state() protected workspaceRentOfferTitle: string | null = null;


  constructor() {
    super();
    this.offerId = this.app.router.getParams().offerId;
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadOfferDetails();
  }

  protected canEditOffer(): boolean {
    const userInfo = this.app.assertAuthUser();
    if (!userInfo || !this.offer) return false;

    const policy = new OfferPolicy(userInfo, this.offer);
    switch (this.offer.type) {
      case 'COURSE_OFFER': return policy.canEditCourse();
      case 'PRODUCT_SALE_OFFER': return policy.canEditProductSale();
      case 'HOBBY_KIT_OFFER': return policy.canEditHobbiKit();
      default: return false; // WorkspaceRentOffer is handled as an error
    }
  }

  protected viewExtendInfo(): boolean {
    const userInfo = this.app.user;
    if (!userInfo.isAuth || !this.offer) return false;

    const policy = new OfferPolicy(userInfo.attrs, this.offer);
    if (policy.canEdit()) return true;

    const workshopInfo = this.app.userWorkshop;
    if (!workshopInfo.isBind) return false;
    const wPolicy = new WorkshopPolicy(userInfo.attrs, workshopInfo.workshop);
    return wPolicy.isEmpoyee();
  }

  /**
   * Loads offer details, including master and model.
   * Reports an error if the offer is of type 'WORKSPACE_RENT_OFFER'.
   */
  private async loadOfferDetails(): Promise<void> {
    this.isLoading = true;
    this.hasError = false;
    this.isRentOfferError = false; // Reset error state
    this.workspaceRentOfferTitle = null; // Reset rent offer title
    this.modelOwner = null; // Reset model owner state

    try {
      const offerResult = await this.offerApi.getOffer(this.offerId);
      if (offerResult.isFailure()) {
        this.app.error('Не удалось загрузить предложение', { result: offerResult.value });
        this.hasError = true;
        this.isLoading = false;
        return;
      }

      // Check if it's a Workspace Rent Offer and set error
      if (offerResult.value.type === 'WORKSPACE_RENT_OFFER') {
        this.isRentOfferError = true;
        this.app.error('Неверный тип предложения. Предложения по аренде рабочего места не могут быть отображены на этой странице.', { offerId: this.offerId });
        this.isLoading = false;
        return;
      }
      
      // Cast to Exclude<OfferAttrs, WorkspaceRentOfferAttrs> after type check
      this.offer = offerResult.value as Exclude<OfferAttrs, WorkspaceRentOfferAttrs>;

      // Load master details
      const masterResult = await this.userApi.getUser(this.offer.masterId);
      if (masterResult.isFailure()) {
        this.app.error(
          'Не удалось загрузить мастера',
          { result: masterResult.value, masterId: this.offer.masterId },
        );
        this.hasError = true;
      } else {
        this.master = masterResult.value;
      }

      // Load model if the offer is not a rent offer (always true now, as rent offers are filtered out)
      const modelResult = await this.modelApi.getModel(this.offer.modelId);
      if (modelResult.isFailure()) {
        this.app.error(
          'Не удалось загрузить модель',
          { result: modelResult.value, modelId: this.offer.modelId },
        );
        this.hasError = true;
      } else {
        this.model = modelResult.value;
        // Load model owner if different from master
        if (this.model && this.master && this.model.ownerId !== this.master.id) {
          const modelOwnerResult = await this.userApi.getUser(this.model.ownerId);
          if (modelOwnerResult.isFailure()) {
            this.app.error(
              'Не удалось загрузить конструктора модели',
              { result: modelOwnerResult.value, modelOwnerId: this.model.ownerId },
            );
            this.hasError = true;
          } else {
            this.modelOwner = modelOwnerResult.value;
          }
        }
      }

      // If it's a Hobby Kit Offer, try to get the title of the referenced Workspace Rent Offer
      if (this.offer.type === 'HOBBY_KIT_OFFER' && this.offer.workspaceRentOfferId) {
        const rentOfferResult = await this.offerApi.getOffer(this.offer.workspaceRentOfferId);
        if (rentOfferResult.isSuccess() && rentOfferResult.value.type === 'WORKSPACE_RENT_OFFER') {
          this.workspaceRentOfferTitle = (rentOfferResult.value as WorkspaceRentOfferAttrs).title;
        } else {
          this.app.error(
            'Не удалось загрузить заголовок абонемента мастерской.',
            { offerId: this.offer.workspaceRentOfferId }
          );
        }
      }

    } catch (err) {
      this.app.error(
        'Произошла непредвиденная ошибка при загрузке деталей предложения',
        { error: err },
      );
      this.hasError = true;
    } finally {
      this.isLoading = false;
    }
  }

  protected getOfferSectionTitle(): string {
    if (!this.offer) return 'Предложение';

    switch (this.offer.type) {
      case 'PRODUCT_SALE_OFFER':
        return 'Предложение: закажи Изделие у мастера!';
      case 'HOBBY_KIT_OFFER':
        return 'Предложение: сделай Изделие Сам!';
      case 'COURSE_OFFER':
        return 'Предложение: пройди курсы, получи навыки и готовое Изделие!';
      default:
        return 'Предложение';
    }
  }

  protected getOrderButtonHref(): string | null {
    if (!this.offer || !this.master || !this.master.profile.telegramNickname) {
      return null;
    }
    const message = encodeURIComponent(`Привет! Меня заинтересовало предложение "${this.offer.title}" (ID: ${this.offer.id}). Хотел(а) бы узнать подробнее.`);
    return `https://t.me/${this.master.profile.telegramNickname}?text=${message}`;
  }

  protected render(): TemplateResult {
    if (this.isLoading) {
      return html`<sl-spinner label="Загрузка предложения..."></sl-spinner>`;
    }
    if (this.isRentOfferError) {
      return html`<div class="error-message">
        Ошибка: Предложения по аренде рабочего места не могут быть отображены на этой странице.
        Пожалуйста, убедитесь, что вы перешли по корректной ссылке.
      </div>`;
    }
    if (!this.offer) {
      return html`<div class="error-message">Предложение не найдено или произошла ошибка загрузки.</div>`;
    }

    const partialLoadError = this.hasError ? html`<div class="error-message">
      Некоторые данные (модель/мастер/конструктор) не удалось загрузить. Попробуйте обновить страницу.
    </div>` : nothing; // Изменено сообщение об ошибке, добавлено "конструктор"

    let durationText: TemplateResult | typeof nothing = nothing;
    if (this.offer.type === 'COURSE_OFFER') {
      durationText = html`<span>Длительность: ${(this.offer as CourseOfferAttrs).durationDays} дней</span>`;
    } else if (this.offer.type === 'PRODUCT_SALE_OFFER') {
      durationText = html`<span>Срок изготовления: ${(this.offer as ProductSaleOfferAttrs).productionTimeDays} дней</span>`;
    }

    return html`
      <div class="offer-details-container">
        ${partialLoadError}

        <h1 class="offer-title">${this.offer.title}</h1>

        <div class="section-header">
          <h2 class="section-title">${this.getOfferSectionTitle()}</h2>
          ${this.renderOfferActions()}
        </div>

        <div class="offer-main-content">
          <div class="offer-description-sector">
            ${markdownUtils.parse(this.offer.description.replace(/\\n/g, '\n'))}
          </div>
          <div class="offer-details-sector">
            <sl-tag size="large" variant="success" class="price-tag">
              ${costUtils.toString(this.offer.cost)}/шт.
            </sl-tag>
            ${durationText ? html`<span class="duration-text">${durationText}</span>` : nothing}
            ${this.renderSpecificOfferDetails(this.offer)}
          </div>
        </div>

        ${this.viewExtendInfo() && this.offer.estimatedExpenses?.length ? html`
          <div class="expense-list">
            <h3>Предполагаемые расходы:</h3>
            <ul>
              ${this.offer.estimatedExpenses.map((expense: ExpenseItem) => html`
                <li><strong>${expense.title}:</strong> ${expense.amount} KZT ${expense.description ? `(${expense.description})` : nothing}</li>
              `)}
            </ul>
          </div>
        ` : nothing}

        <hr>

        ${this.master ? html`
          <user-info-card .user=${this.master} title="О Мастере"></user-info-card>
        ` : nothing}

        ${this.model ? html`
          <div class="section-header">
            <h2 class="section-title">О Модели</h2>
            ${this.renderModelActions()}
          </div>
          <div class="model-info-section">
            ${this.model.imageIds.length ? html`
              <model-images
                .imageIds=${this.model.imageIds}
                .canEdit=${false}
              ></model-images>
            ` : nothing}

            <div class="model-info-grid">
              <div class="detail-item">
                <strong>Название:</strong>
                <span>${this.model.title}</span>
              </div>
              <div class="detail-item">
                <strong>Категория:</strong>
                <span>
                  ${this.model.categories.map((category: ModelCategory) => html`
                    <sl-tag size="small" variant="neutral">${MODEL_CATEGORY_TITLES[category] || category}</sl-tag>
                  `)}
                </span>
              </div>
              <div class="detail-item">
                <strong>Уровень сложности:</strong>
                <span>${SKILL_LEVEL_TITLES[this.model.difficultyLevel]}</span>
              </div>
              <div class="detail-item">
                <strong>Примерное время изготовления:</strong>
                <span>${this.model.estimatedTime}</span>
              </div>
            </div>
            <div class="detail-item">
              <strong>Описание модели:</strong>
              <span>${markdownUtils.parse(this.model.description.replace(/\\n/g, '\n'))}</span>
            </div>

            ${this.modelOwner && this.model.ownerId !== this.master?.id ? html`
              <user-info-card .user=${this.modelOwner} title="О Конструкторе Модели" .showActions=${false}></user-info-card>
            ` : html`
              <div class="model-owner-info">
                  <strong>Конструктор модели:</strong>
                  <span>
                    ${this.master && this.model.ownerId === this.master.id
                      ? html`То же, что и мастер предложения (${this.master.name})`
                      : html`ID: ${this.model.ownerId} (возможно, другой пользователь)`
                    }
                  </span>
                  <p>Чтобы узнать больше информации о модели, нажмите на кнопку (<sl-icon name="link"></sl-icon>).</p>
              </div>
            `}
          </div>
        ` : nothing}

        ${this.viewExtendInfo() ? html`
          <div class="admin-info" style="margin-top: 30px; font-size: 0.85rem; color: var(--sl-color-neutral-500);">
            <p>Создано: ${new Date(this.offer.createAt).toLocaleDateString()} ${new Date(this.offer.createAt).toLocaleTimeString()}</p>
            <p>Обновлено: ${new Date(this.offer.updateAt).toLocaleDateString()} ${new Date(this.offer.updateAt).toLocaleTimeString()}</p>
            <p>Статус: <sl-tag size="small" variant="${this.getStatusVariant(this.offer.status)}">${this.getStatusText(this.offer.status)}</sl-tag></p>
          </div>
        ` : nothing}
      </div>
    `;
  }

  // --- Методы рендеринга кнопок остаются без изменений, кроме того, что они теперь вызываются из offer-details ---

  protected renderOfferActions(): TemplateResult | typeof nothing {
    const orderHref = this.getOrderButtonHref();
    const canEdit = this.canEditOffer();

    // Если нет ни одной кнопки, ничего не рендерим
    if (!orderHref && !canEdit) {
        return nothing;
    }

    return html`
      <sl-button-group>
        ${orderHref ? html`
          <sl-tooltip content="Заказать / Задать вопрос">
            <sl-button
              size="small"
              variant="primary"
              href=${orderHref}
              target="_blank"
              rel="noopener"
            >
              <sl-icon name="cart"></sl-icon>
            </sl-button>
          </sl-tooltip>
        ` : nothing}

        <sl-dropdown placement="bottom-end" hoist>
          <sl-button size="small" slot="trigger" variant="primary" caret> </sl-button>
          <sl-menu>
            ${orderHref ? html`
              <sl-menu-item
                href=${orderHref}
                target="_blank"
                rel="noopener"
              >
                <sl-icon slot="prefix" name="cart"></sl-icon>
                Заказать / Задать вопрос
              </sl-menu-item>
            ` : nothing}
            ${canEdit ? html`
              <sl-menu-item @click=${this.openEditOfferModal}>
                <sl-icon slot="prefix" name="pencil"></sl-icon>
                Редактировать предложение
              </sl-menu-item>
            ` : nothing}
          </sl-menu>
        </sl-dropdown>
      </sl-button-group>
    `;
  }

  protected renderModelActions(): TemplateResult | typeof nothing {
    if (!this.model) {
      return nothing;
    }

    const modelPageHref = `/models/${this.model.id}`;

    return html`
      <sl-button-group>
        ${modelPageHref ? html`
          <sl-tooltip content="Подробнее о модели">
            <sl-button
              size="small"
              variant="primary"
              href=${modelPageHref}
            >
              <sl-icon name="link"></sl-icon>
            </sl-button>
          </sl-tooltip>
        ` : nothing}

        <sl-dropdown placement="bottom-end" hoist>
          <sl-button size="small" slot="trigger" variant="primary" caret> </sl-button>
          <sl-menu>
            <sl-menu-item
              href=${modelPageHref}
            >
              <sl-icon slot="prefix" name="link"></sl-icon>
              Подробнее о модели
            </sl-menu-item>
          </sl-menu>
        </sl-dropdown>
      </sl-button-group>
    `;
  }

  private async openEditOfferModal() {
    this.app.error('Функционал редактирования еще не реализован.');
  }

  protected renderSpecificOfferDetails(offer: Exclude<OfferAttrs, WorkspaceRentOfferAttrs>): TemplateResult {
    switch (offer.type) {
      case 'COURSE_OFFER':
        const courseOffer = offer as CourseOfferAttrs;
        return html`
          <div class="offer-details-grid">
            <div class="detail-item">
              <strong>Часы работы в мастерской:</strong> <span>${courseOffer.activeWorkshopHours} ч.</span>
            </div>
            <div class="detail-item">
              <strong>Мин. студентов:</strong> <span>${courseOffer.minStudents}</span>
            </div>
            <div class="detail-item">
              <strong>Макс. студентов:</strong> <span>${courseOffer.maxStudents}</span>
            </div>
          </div>
        `;
      case 'HOBBY_KIT_OFFER':
        const hobbyKitOffer = offer as HobbyKitOfferAttrs;
        return html`
          <div class="offer-details-grid">
            <div class="detail-item">
              <strong>Время подготовки материалов:</strong>
              <span>${hobbyKitOffer.materialPreparationHours} ч</span>
            </div>
            <div class="detail-item">
              <strong>Включённый абонемент:</strong>
              <span>
                ${this.workspaceRentOfferTitle
                  ? html`${this.workspaceRentOfferTitle}`
                  : html`ID: ${hobbyKitOffer.workspaceRentOfferId} (название не загружено)`
                }
              </span>
            </div>
          </div>
        `;
      case 'PRODUCT_SALE_OFFER':
        return html``;
      default:
        return html``;
    }
  }

  protected getStatusVariant(status: OfferStatus) {
    switch (status) {
      case 'active': return 'success';
      case 'pending_moderation': return 'warning';
      case 'archived': return 'neutral';
      default: return 'neutral';
    }
  }

  protected getStatusText(status: OfferStatus) {
    switch (status) {
      case 'active': return 'Активно';
      case 'pending_moderation': return 'На модерации';
      case 'archived': return 'Архив';
      default: return status;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'offer-details': OfferDetails;
  }
}
