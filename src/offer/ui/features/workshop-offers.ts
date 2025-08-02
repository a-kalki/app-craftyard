import { html, css, type TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { BaseElement } from '#app/ui/base/base-element';
import type { WorkshopAttrs } from '#workshop/domain/struct/attrs';
import { WorkshopPolicy } from '#workshop/domain/policy';
import { nothing } from 'lit';
import type { OfferAttrs, OfferTypes } from '#offer/domain/types';

@customElement('workshop-offers')
export class WorkshopOffers extends BaseElement {
  static styles = css`
    :host {
      display: block;
      height: 100%;
    }

    .workshop-page-container {
      width: 100%;
      margin: 8px auto;
      background: var(--sl-color-neutral-0);
      border-radius: var(--sl-border-radius-medium);
      box-shadow: var(--sl-shadow-large);
      
      height: calc(100% - 16px);
      display: flex;
      flex-direction: column;
    }

    .sticky-workshop-header {
      position: sticky;
      top: 0;
      z-index: 20;
      background-color: var(--sl-color-neutral-0);
      box-shadow: var(--sl-shadow-small);
    }

    .offers-content-wrapper {
      flex-grow: 1;
      overflow-y: auto;
      padding: 16px;
      box-sizing: border-box;
    }

    .tabs-and-button-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 0 16px 16px;
      background-color: var(--sl-color-neutral-0);
      border-bottom: 1px solid var(--sl-color-neutral-200);
    }

    .tabs-wrapper {
      flex-grow: 1;
      min-width: 0; /* Позволяет flex-элементу сжиматься */
      /* overflow-x: auto; и скрытие скроллбара удалены */
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
      /* width: max-content; min-width: 100%; удалены */
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

    @media (max-width: 768px) {
      :host {
        padding-top: 24px;
      }

      .workshop-page-container {
        margin: 0;
        border-radius: 0;
        box-shadow: none;
        height: 100%;
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
      .offers-content-wrapper {
        padding: 16px;
      }
    }
  `;

  @state() workshopId: string;
  @state() private workshop: WorkshopAttrs | null = null;
  @state() private canEdit = false;
  @state() private activeTabId: OfferTypes = 'WORKSPACE_RENT_OFFER';
  
  @state() private allOffers: OfferAttrs[] = [];
  @state() private isLoadingOffers: boolean = true;

  constructor() {
    super();
    this.workshopId = this.app.router.getParams().workshopId;
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadWorkshopData();
  }

  private handleTabShow(event: CustomEvent) {
    this.activeTabId = event.detail.name as OfferTypes;
  }

  private async loadWorkshopData(forceRefresh?: boolean) {
    if (!this.workshopId) {
      this.app.error(
        `[${this.constructor.name}]: Не удалось распарсить workshopId.`,
      );
      return;
    }
    this.isLoadingOffers = true;
    const workshopResult = await this.workshopApi.getWorkshop(this.workshopId, forceRefresh);
    if (workshopResult.isFailure()) {
      this.app.error(
        'Не удалось загрузить данные мастерской для страницы оффера',
        { details: { result: workshopResult.value, workshopId: this.workshopId } }
      );
      this.isLoadingOffers = false;
      return;
    }
    this.workshop = workshopResult.value;
    const userInfo = this.app.userInfo;
    if (userInfo.isAuth) {
      this.canEdit = new WorkshopPolicy(userInfo.user, this.workshop).canEdit();
    }

    const offersResult = await this.offerApi.getWorkshopOffers(this.workshopId, forceRefresh);
    if (offersResult.isFailure()) {
      this.app.error('Не удалось загрузить все офферы мастерской', {
        details: { result: offersResult.value, workshopId: this.workshopId },
      });
      this.allOffers = [];
    } else {
      this.allOffers = offersResult.value;
    }
    this.isLoadingOffers = false;
  }

  /** Можно добавлять только предложения абонемента. Остальные через карточки моделей. */
  private async handleAddOfferButtonClick() {
    if (!this.workshop) {
      this.app.error('Данные мастерской не загружены. Невозможно добавить Оффер.');
      return;
    }
    if (this.activeTabId !== 'WORKSPACE_RENT_OFFER') {
      this.app.error('Можно добавлять только "Офферы абонемента"');
      return;
    }

    try {
      const modal = document.createElement('add-workspace-rent-offer-modal');
      // @ts-ignore
      const result = await modal.show('WORKSPACE_RENT_OFFER', this.workshop);

      if (result && result.offerId) {
        this.app.info(`Оффер успешно добавлен! ID: ${result.offerId}`);
        this.loadWorkshopData(true);
      } else {
        this.app.info('Не удалось добавить Оффер.');
      }
    } catch (error) {
      this.app.error(`Ошибка при добавлении Оффера: ${(error as Error).message}`, { details: { error } });
    }
  }

  protected renderTabsAndAddSectionButton(): TemplateResult {
    return html`
      <div class="tabs-and-button-row">
        <div class="tabs-wrapper">
          <sl-tab-group @sl-tab-show=${this.handleTabShow} active-tab=${this.activeTabId}>
            <sl-tab
              slot="nav"
              panel="WORKSPACE_RENT_OFFER"
              ?active=${this.activeTabId === 'WORKSPACE_RENT_OFFER'}
            > Взять абонемент </sl-tab>
            <sl-tab
              slot="nav"
              panel="PRODUCT_SALE_OFFER"
              ?active=${this.activeTabId === 'PRODUCT_SALE_OFFER'}
            > Купить Изделие </sl-tab>
            <sl-tab
              slot="nav"
              panel="HOBBY_KIT_OFFER"
              ?active=${this.activeTabId === 'HOBBY_KIT_OFFER'}
            > Сделать изделие </sl-tab>
            <sl-tab
              slot="nav"
              panel="COURSE_OFFER"
              ?active=${this.activeTabId === 'COURSE_OFFER'}
            > Пройти курсы </sl-tab>
          </sl-tab-group>
        </div>
        
        ${this.canEdit && this.activeTabId === 'WORKSPACE_RENT_OFFER' ? html`
          <div class="add-section-button">
            <sl-icon-button 
              name="plus-square"
              label="Добавить Оффер"
              tabindex="0"
              @click=${this.handleAddOfferButtonClick}
            ></sl-icon-button>
          </div>
        ` : nothing}
      </div>
    `;
  }

  private handleOffersListChanged(e: Event): void {
    this.loadWorkshopData(true);
    e.preventDefault();
  }

  render() {
    if (!this.workshop || this.isLoadingOffers) {
      return html`
        <div class="workshop-page-container">
          <div style="text-align: center; padding: 20px;">
            <sl-spinner
              style="width:48px; height:48px; display: inline-block;"
              label="Загрузка Офферов..."
            ></sl-spinner>
            <p>Загрузка данных мастерской и офферов...</p>
          </div>
        </div>
      `;
    }

    let showAdminInfo: boolean = false;
    const { userInfo } = this.app;
    if (userInfo.isAuth) {
      const policy = new WorkshopPolicy(userInfo.user, this.workshop);
      showAdminInfo = policy.isEditor() || policy.isModerator() || policy.isMentor();
    }

    return html`
      <div class="workshop-page-container">
        <div class="sticky-workshop-header">
          <workshop-header
            .workshop=${this.workshop}
            activePage="offers"
            .canEdit=${this.canEdit}
          ></workshop-header>
          ${this.renderTabsAndAddSectionButton()}
        </div>
        
        <div class="offers-content-wrapper">
          <sl-tab-panel name="WORKSPACE_RENT_OFFER" ?active=${this.activeTabId === 'WORKSPACE_RENT_OFFER'}>
            <offer-list-container
              .workshopId=${this.workshop.id}
              .showAdminInfo=${showAdminInfo}
              .offerType=${'WORKSPACE_RENT_OFFER'}
              .canEdit=${this.canEdit}
              .offersData=${this.allOffers.filter(o => o.type === 'WORKSPACE_RENT_OFFER')}
              @offers-list-changed=${this.handleOffersListChanged}
            ></offer-list-container>
          </sl-tab-panel>
          <sl-tab-panel name="PRODUCT_SALE_OFFER" ?active=${this.activeTabId === 'PRODUCT_SALE_OFFER'}>
            <offer-list-container
              .workshopId=${this.workshop.id}
              .showAdminInfo=${showAdminInfo}
              .offerType=${'PRODUCT_SALE_OFFER'}
              .canEdit=${this.canEdit}
              .offersData=${this.allOffers.filter(o => o.type === 'PRODUCT_SALE_OFFER')}
              @offers-list-changed=${this.handleOffersListChanged}
            ></offer-list-container>
          </sl-tab-panel>
          <sl-tab-panel name="HOBBY_KIT_OFFER" ?active=${this.activeTabId === 'HOBBY_KIT_OFFER'}>
            <offer-list-container
              .workshopId=${this.workshop.id}
              .showAdminInfo=${showAdminInfo}
              .offerType=${'HOBBY_KIT_OFFER'}
              .canEdit=${this.canEdit}
              .offersData=${this.allOffers.filter(o => o.type === 'HOBBY_KIT_OFFER')}
              @offers-list-changed=${this.handleOffersListChanged}
            ></offer-list-container>
          </sl-tab-panel>
          <sl-tab-panel name="COURSE_OFFER" ?active=${this.activeTabId === 'COURSE_OFFER'}>
            <offer-list-container
              .workshopId=${this.workshop.id}
              .showAdminInfo=${showAdminInfo}
              .offerType=${'COURSE_OFFER'}
              .canEdit=${this.canEdit}
              .offersData=${this.allOffers.filter(o => o.type === 'COURSE_OFFER')}
              @offers-list-changed=${this.handleOffersListChanged}
            ></offer-list-container>
          </sl-tab-panel>
        </div>
      </div>
    `;
  }
}
