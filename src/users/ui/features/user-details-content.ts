import { html, css, type TemplateResult } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { BaseElement } from '../../../app/ui/base/base-element';
import type { UserAttrs } from '#users/domain/user/struct/attrs';
import type { ThesisContent } from '#user-contents/domain/content/struct/thesis-attrs';
import type { ModelAttrs } from '#models/domain/struct/attrs';
import type { OfferAttrs } from '#offer/domain/types';
import { BaseOfferCard } from '#offer/ui/entity/base/base-offer-card';
import { HobbyKitOfferCard } from '#offer/ui/entity/hobby-kit/hobby-kit-offer-card';
import { ProductSaleOfferCard } from '#offer/ui/entity/product-sale/product-sale-offer-card';
import { CourseOfferCard } from '#offer/ui/entity/course/course-offer-card';
import type { UserContributionCounter, UserContributionKey } from '#users/domain/user-contributions/types';
import { USER_CONTRIBUTIONS_DETAILS } from '#users/domain/user-contributions/constants';

@customElement('user-details-content')
export class UserDetailsContent extends BaseElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      background: var(--sl-color-neutral-0);
      border-radius: var(--sl-border-radius-medium);
      box-shadow: var(--sl-shadow-large);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .tabs-wrapper {
      flex-shrink: 0;
      min-width: 0;
    }

    sl-tab-group {
      --track-color: transparent;
      --indicator-color: var(--sl-color-primary-600);
      --indicator-border-radius: 0;
      --active-tab-color: var(--sl-color-primary-600);
      --inactive-tab-color: var(--sl-color-neutral-600);
      --focus-ring-width: 0;
      padding: 0 1rem;
      border-bottom: 1px solid var(--sl-color-neutral-200);
    }

    .content-panel-wrapper {
      flex-grow: 1;
      overflow-y: auto;
      padding: 1rem;
    }

    .list-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      justify-content: flex-start;
    }

    .list-grid > * {
      flex: 1 0 300px;
      width: 100%;
    }

    .skills-list {
      display: flex;
      flex-wrap: wrap;
      gap: var(--sl-spacing-x-small);
      justify-content: flex-start;
    }

    .skills-list > * {
      flex: 1 0 280px;
      min-width: 280px;
      max-width: 100%;
    }

    /* Медиа-запросы для адаптивности списков, теперь на основе flex-basis */
    @media (max-width: 600px) {
      .list-grid > *,
      .skills-list > * {
        flex-basis: 100%;
      }
    }

    @media (min-width: 601px) and (max-width: 991px) {
      .list-grid > *,
      .skills-list > * {
        flex-basis: calc(50% - 8px);
      }
    }

    @media (min-width: 992px) {
      .list-grid > *,
      .skills-list > * {
        flex-basis: calc(33.333% - 10.666px);
      }
    }

    /* Если нужно 4 колонки на очень больших экранах */
    @media (min-width: 1200px) {
      .list-grid > * {
        flex-basis: calc(25% - 12px);
      }
    }

    sl-spinner {
      display: block;
      margin: 50px auto;
      font-size: 2.5rem;
    }

    .offers-filter-bar {
      display: flex;
      justify-content: flex-end;
      background-color: transparent;
      position: sticky;
      top: 0;
      z-index: 10;
      margin-top: -1rem;
      margin-right: -1rem;
      padding-right: 1rem;
    }

    /* Стили для пунктов меню фильтра */
    sl-menu-item sl-icon {
      margin-right: 0.5rem;
    }
  `;

  @property({ type: Object })
  user!: UserAttrs;

  @property({ type: Boolean })
  canEdit: boolean = false;

  @state() private isLoading: boolean = true;
  @state() private skills: ThesisContent[] = [];
  @state() private models: ModelAttrs[] = [];
  @state() private offers: OfferAttrs[] = [];
  @state() private contributions: { key: UserContributionKey, counter: UserContributionCounter }[] = [];
  @state() private activeTab: 'contributions' | 'skills' | 'models' | 'offers' = 'contributions';

  @state() private activeOfferFilter: string[] = ['all'];

  // Получаем ссылку на sl-tab-group в DOM
  @query('sl-tab-group')
  private tabGroup!: HTMLElement & { activeTab: string }; // Уточняем тип для доступа к activeTab

  connectedCallback(): void {
    super.connectedCallback();
    this.loadAllContent();
  }

  willUpdate(changedProperties: Map<PropertyKey, unknown>): void {
    if (
      (changedProperties.has('user') && changedProperties.get('user') !== undefined) ||
      changedProperties.has('canEdit')
    ) {
      this.loadAllContent();
    }
  }

  updated(changedProperties: Map<string | symbol, unknown>): void {
    super.updated(changedProperties);
    if (this.tabGroup && this.tabGroup.activeTab !== this.activeTab) {
      this.tabGroup.activeTab = this.activeTab;
    }
  }

  async updateSkills(): Promise<void> {
    const getResult = await this.userContentApi.getSectionContens(
      this.user.profile.skillsContentSectionId, true // forceRefresh для получения свежих данных
    );
    if (getResult.isFailure()) {
      this.app.error('Не удалось обновить навыки.', { details: { error: getResult.value } });
      return;
    }
    this.skills = getResult.value
      .filter(c => c.type === 'THESIS')
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  private async loadAllContent(forceRefresh?: boolean): Promise<void> {
    this.isLoading = true;
    this.skills = [];
    this.models = [];
    this.offers = [];
    this.contributions = [];

    try {
      const [skillsResult, modelsResult, offersResult] = await Promise.all([
        this.userContentApi.getSectionContens(this.user.profile.skillsContentSectionId, forceRefresh),
        this.modelApi.getModels({ ownerId: this.user.id }),
        this.offerApi.getMasterOffers(this.user.id, forceRefresh),
      ]);

      if (skillsResult.isSuccess()) {
        this.skills = skillsResult.value
          .filter(c => c.type === 'THESIS')
          .sort((a, b) => (a.order || 0) - (b.order || 0));
      } else {
        this.app.error(
          'Не удалось загрузить навыки пользователя.',
          { details: { error: skillsResult.value } },
        );
      }

      if (modelsResult.isSuccess()) {
        this.models = modelsResult.value;
      } else {
        this.app.error(
          'Не удалось загрузить модели пользователя.',
          { details: { error: modelsResult.value } }
        );
      }

      if (offersResult.isSuccess()) {
        this.offers = offersResult.value;
      } else {
        this.app.error(
          'Не удалось загрузить Офферы пользователя.',
          { details: { error: offersResult.value } }
        );
      }

      // Обработка данных вклада
      if (this.user.statistics && this.user.statistics.contributions) {
        const processedContributions: { key: UserContributionKey, counter: UserContributionCounter }[] = [];
        const contributionKeys = Object.keys(this.user.statistics.contributions) as UserContributionKey[];
        
        // Сортируем ключи вклада по orderNumber, чтобы карточки отображались в логичном порядке
        contributionKeys.sort((a, b) => {
          const orderA = USER_CONTRIBUTIONS_DETAILS[a]?.orderNumber || 999;
          const orderB = USER_CONTRIBUTIONS_DETAILS[b]?.orderNumber || 999;
          return orderA - orderB;
        }).forEach(key => {
          const counter = this.user!.statistics.contributions[key];
          if (counter) {
            processedContributions.push({ key, counter });
          }
        });
        this.contributions = processedContributions;
      }

    } catch (error) {
      this.app.error(
        'Произошла непредвиденная ошибка при загрузке контента профиля.',
        { details: { error } }
      );
    } finally {
      this.isLoading = false;
    }
  }

  private handleTabShow(event: CustomEvent): void {
    this.activeTab = event.detail.name;
  }

  // Методы getOfferTypeLabel и getOfferTypeColor удалены,
  // так как их реализация должна быть в компонентах карточек офферов.

  private handleOfferFilterChange(type: string): void {
    const remove = (value: string) => {
      this.activeOfferFilter = this.activeOfferFilter.filter(t => t !== value);
    }

    if (type === 'all') {
      this.activeOfferFilter = ['all'];
      return;
    }
    if (this.activeOfferFilter.includes('all')) {
      remove('all');
    }

    if (this.activeOfferFilter.includes(type)) remove(type);
    else this.activeOfferFilter = [ ...this.activeOfferFilter, type ];

    if (this.activeOfferFilter.length === 0) this.activeOfferFilter = ['all'];
  }

  private renderOfferCard(offer: OfferAttrs): TemplateResult {
    switch (offer.type) {
      case 'PRODUCT_SALE_OFFER':
        return html`<product-sale-offer-card .offer=${offer} .stylize=${true}></product-sale-offer-card>`;
      case 'HOBBY_KIT_OFFER':
        return html`<hobby-kit-offer-card .offer=${offer} .stylize=${true}></hobby-kit-offer-card>`;
      case 'COURSE_OFFER':
        return html`<course-offer-card .offer=${offer} .stylize=${true}></course-offer-card>`;
      case 'WORKSPACE_RENT_OFFER':
        return html`<workspace-rent-offer-card .offer=${offer} .stylize=${true}></workspace-rent-offer-card>`;
      default:
        return html``;
    }
  }

  private getFilterOfferTypes(): Record<string, string> {
    return {
      ...BaseOfferCard.filterLabel,
      ...HobbyKitOfferCard.filterLabel,
      ...ProductSaleOfferCard.filterLabel,
      ...CourseOfferCard.filterLabel,
    }
  }

  render(): TemplateResult {
    if (this.isLoading) {
      return html`<sl-spinner label="Загрузка контента профиля..."></sl-spinner>`;
    }

    if (!this.user) {
      return html`<p
        style="text-align: center; padding: 20px;"
      >Пользователь не найден или произошла ошибка загрузки.</p>`;
    }

    const allfilterTypes = this.getFilterOfferTypes();

    // Отфильтрованные предложения
    const filteredOffers = this.activeOfferFilter.includes('all')
      ? this.offers
      : this.offers.filter(offer => this.activeOfferFilter.includes(offer.type));

    return html`
      <div class="tabs-wrapper">
        <sl-tab-group @sl-tab-show=${this.handleTabShow} active-tab=${this.activeTab}>
          <sl-tab slot="nav" panel="contributions">Вклад</sl-tab>
          <sl-tab slot="nav" panel="skills">Навыки</sl-tab>
          <sl-tab slot="nav" panel="models">Модели</sl-tab>
          <sl-tab slot="nav" panel="offers">Офферы</sl-tab>
        </sl-tab-group>
      </div>

      <div class="content-panel-wrapper">
        <sl-tab-panel name="contributions" ?active=${this.activeTab === 'contributions'}>
          <div class="list-grid">
            ${this.contributions.length === 0
              ? html`<p>Данные о вкладе отсутствуют.</p>`
              : this.contributions.map(c => html`<user-contribution-card
                                     .key=${c.key}
                                     .counter=${c.counter}
              ></user-contribution-card>`)}
          </div>
        </sl-tab-panel>

        <sl-tab-panel name="skills" ?active=${this.activeTab === 'skills'}>
          <div class="skills-list">
            ${this.skills.length === 0
              ? html`<p>Навыки не указаны.</p>`
              : this.skills.map(skill => html`<thesis-card
                                 .content=${skill}
                                 .canEdit=${this.canEdit}
                                 @content-edited=${() => this.updateSkills()}
                                 @content-deleted=${() => this.updateSkills()}
              ></thesis-card>`)}
          </div>
        </sl-tab-panel>

        <sl-tab-panel name="models" ?active=${this.activeTab === 'models'}>
          <div class="list-grid">
            ${this.models.length === 0
              ? html`<p>Модели не найдены.</p>`
              : this.models.map(model => html`<model-card .model=${model}></model-card>`)}
          </div>
        </sl-tab-panel>

        <sl-tab-panel name="offers" ?active=${this.activeTab === 'offers'}>
          <div class="offers-filter-bar">
            <sl-dropdown placement="bottom-end" hoist>
              <sl-button size="small" slot="trigger" variant="neutral" caret>
                <sl-icon name="funnel"></sl-icon> <!-- Иконка фильтра -->
              </sl-button>
              <sl-menu>
                <sl-menu-item 
                  type="checkbox" 
                  ?checked=${this.activeOfferFilter.includes('all')} 
                  @click=${(e: Event) => { e.stopPropagation(); this.handleOfferFilterChange('all'); }} 
                >
                  <sl-icon slot="prefix" name="grid"></sl-icon>
                  ${allfilterTypes['all']}
                </sl-menu-item>
                <sl-divider></sl-divider>
                ${Object.keys(allfilterTypes).filter(type => type !== 'all').map(type => html`
                  <sl-menu-item
                    type="checkbox" 
                    ?checked=${this.activeOfferFilter.includes(type)}
                    @click=${(e: Event) => { e.stopPropagation(); this.handleOfferFilterChange(type); }} 
                  >
                    <sl-icon slot="prefix" name="tag"></sl-icon>
                    ${allfilterTypes[type]}
                  </sl-menu-item>
                `)}
              </sl-menu>
            </sl-dropdown>
          </div>
          <div class="list-grid">
            ${filteredOffers.length === 0
              ? html`<p>Офферы не найдены.</p>`
              : filteredOffers.map(offer => this.renderOfferCard(offer))}
          </div>
        </sl-tab-panel>
      </div>
    `;
  }
}
