import { html, css, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { ModelAttrs } from '#models/domain/struct/attrs';
import { BaseElement } from '../../../app/ui/base/base-element';
import { MODEL_CATEGORY_TITLES, MODEL_CATEGORY_KEYS } from '#models/domain/struct/constants';
import { SKILL_LEVEL_TITLES, SKILL_LEVEL_KEYS } from '#app/core/constants';
import { ContributionPolicy } from '#users/domain/user-contributions/policy';

@customElement('models-list')
export class ModelsWidget extends BaseElement {
  static styles = css`
    :host {
      display: block;
      height: 100%;
      width: 100%;
      overflow-y: auto;
      padding: 16px;
      box-sizing: border-box;
    }

    .models-list-wrapper {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .header-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      position: sticky;
      top: 0;
      z-index: 10;
      background-color: var(--sl-color-neutral-0);
      padding-bottom: 8px;
      padding-top: 8px;
      margin-top: -16px;
      margin-left: -16px;
      margin-right: -16px;
      padding-left: 16px;
      padding-right: 16px;
      border-bottom: 1px solid var(--sl-color-neutral-200);
    }

    .filters-group {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .grid {
      display: grid;
      gap: 16px;
      width: 100%;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      flex-grow: 1;
      overflow-y: auto;
    }

    @media (max-width: 768px) {
      :host {
        padding-top: 24px;
      }
    }


    /* Медиа-запросы для более тонкой настройки */
    @media (max-width: 600px) {
      .grid {
        grid-template-columns: 1fr;
      }
      .header-bar {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
      }
      .filters-group {
        width: 100%;
        justify-content: space-between;
      }
      .add-button-wrapper {
        width: 100%;
        text-align: right;
      }
    }

    @media (min-width: 601px) and (max-width: 991px) {
      .grid {
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      }
    }

    @media (min-width: 992px) and (max-width: 1200px) {
      .grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (min-width: 1201px) {
        .grid {
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        }
    }

    model-card {
      width: 100%;
      min-width: 0;
    }

    sl-spinner {
      display: block;
      margin: 50px auto;
      font-size: 2.5rem;
    }
  `;

  @state()
  private models: ModelAttrs[] = [];

  @state()
  private isLoading: boolean = true;

  @state()
  private selectedOwnerFilter: 'all' | 'my' = 'all';

  @state()
  private selectedCategoryFilter: string[] = ['all'];

  @state()
  private selectedLevelFilter: string[] = ['all'];

  async connectedCallback() {
    super.connectedCallback();
    await this.loadModels();
  }

  private async loadModels(): Promise<void> {
    this.isLoading = true;
    const result = await this.modelApi.getModels({});
    if (result.isFailure()) {
      this.app.error('Не удалось загрузить модели. Попробуйте позже.', { details: { result: result.value } });
      this.models = [];
      this.isLoading = false;
      return;
    }
    this.models = result.value;
    this.isLoading = false;
  }

  protected canAdd(): boolean {
    const userInfo = this.app.userInfo;
    if (!userInfo.isAuth) return false;

    const policy = new ContributionPolicy(userInfo.user);
    return policy.canAddModel();
  }

  private async onAddModelClick(): Promise<void> {
    const modal = document.createElement('add-model-modal');
    const result = await modal.show();
    if (result) {
      this.loadModels();
    }
  }

  private handleOwnerFilterChange(event: CustomEvent): void {
    this.selectedOwnerFilter = event.detail.item.value;
  }

  private handleCategoryFilterChange(event: CustomEvent): void {
    const value = event.detail.item.value;
    const isChecked = event.detail.item.checked;

    if (value === 'all') {
      this.selectedCategoryFilter = ['all'];
    } else {
      let newSelection = isChecked
        ? [...this.selectedCategoryFilter, value]
        : this.selectedCategoryFilter.filter(item => item !== value);

      if (newSelection.includes('all') && value !== 'all') {
        newSelection = newSelection.filter(item => item !== 'all');
      }
      
      if (newSelection.length === 0) {
        newSelection = ['all'];
      }
      this.selectedCategoryFilter = newSelection;
    }
  }

  private handleLevelFilterChange(event: CustomEvent): void {
    const value = event.detail.item.value;
    const isChecked = event.detail.item.checked;

    if (value === 'all') {
      this.selectedLevelFilter = ['all'];
    } else {
      let newSelection = isChecked
        ? [...this.selectedLevelFilter, value]
        : this.selectedLevelFilter.filter(item => item !== value);

      // Если 'all' был выбран, удаляем его при выборе конкретного уровня
      if (newSelection.includes('all') && value !== 'all') {
        newSelection = newSelection.filter(item => item !== 'all');
      }

      // Если никаких уровней не выбрано, возвращаемся к 'all'
      if (newSelection.length === 0) {
        newSelection = ['all'];
      }
      this.selectedLevelFilter = newSelection;
    }
  }

  private getFilteredModels(): ModelAttrs[] {
    let filtered = this.models;

    // Фильтрация по владельцу
    if (this.selectedOwnerFilter === 'my' && this.app.userInfo.isAuth) {
      // @ts-expect-error: почему то дает ошибку, якобы user не существует.
      filtered = filtered.filter(model => model.ownerId === this.app.userInfo.user?.id);
    }

    // Фильтрация по категории (множественный выбор)
    if (!this.selectedCategoryFilter.includes('all')) {
      filtered = filtered.filter(model => 
        model.categories.some(cat => this.selectedCategoryFilter.includes(cat))
      );
    }

    // Фильтрация по уровню (множественный выбор)
    if (!this.selectedLevelFilter.includes('all')) {
      filtered = filtered.filter(model => 
        this.selectedLevelFilter.includes(model.difficultyLevel)
      );
    }

    return filtered;
  }

  render() {
    const filteredModels = this.getFilteredModels();
    const isUserAuthenticated = this.app.userInfo.isAuth;

    // Опции фильтрации по пользователю
    const ownerFilterOptions = [
      { value: 'all', label: 'Все модели' },
      ...(isUserAuthenticated ? [{ value: 'my', label: 'Мои модели' }] : []),
    ];

    return html`
      <div class="models-list-wrapper">
        <div class="header-bar">
          <div class="filters-group">
            <sl-dropdown placement="bottom-start" hoist>
              <sl-button size="small" slot="trigger" variant="neutral" caret>
                <sl-icon name="person"></sl-icon>
                Пользователь
              </sl-button>
              <sl-menu @sl-select=${this.handleOwnerFilterChange}>
                ${ownerFilterOptions.map(option => html`
                  <sl-menu-item 
                    value=${option.value} 
                    ?checked=${this.selectedOwnerFilter === option.value}
                    type="checkbox"
                  >
                    ${option.label}
                  </sl-menu-item>
                `)}
              </sl-menu>
            </sl-dropdown>

            <sl-dropdown placement="bottom-start" hoist>
              <sl-button size="small" slot="trigger" variant="neutral" caret>
                <sl-icon name="tag"></sl-icon>
                Категория
              </sl-button>
              <sl-menu @sl-select=${this.handleCategoryFilterChange}>
                <sl-menu-item 
                  value="all" 
                  ?checked=${this.selectedCategoryFilter.includes('all')}
                  type="checkbox"
                >
                  Все категории
                </sl-menu-item>
                ${MODEL_CATEGORY_KEYS.map(key => html`
                  <sl-menu-item 
                    value=${key} 
                    ?checked=${this.selectedCategoryFilter.includes(key)}
                    type="checkbox"
                  >
                    ${MODEL_CATEGORY_TITLES[key]}
                  </sl-menu-item>
                `)}
              </sl-menu>
            </sl-dropdown>

            <sl-dropdown placement="bottom-start" hoist>
              <sl-button size="small" slot="trigger" variant="neutral" caret>
                <sl-icon name="bar-chart"></sl-icon>
                Уровень
              </sl-button>
              <sl-menu @sl-select=${this.handleLevelFilterChange}>
                <sl-menu-item 
                  value="all" 
                  ?checked=${this.selectedLevelFilter.includes('all')}
                  type="checkbox"
                >
                  Все уровни
                </sl-menu-item>
                ${SKILL_LEVEL_KEYS.map(key => html`
                  <sl-menu-item 
                    value=${key} 
                    ?checked=${this.selectedLevelFilter.includes(key)}
                    type="checkbox"
                  >
                    ${SKILL_LEVEL_TITLES[key]}
                  </sl-menu-item>
                `)}
              </sl-menu>
            </sl-dropdown>
          </div>

          ${this.canAdd() ? html`
            <div class="add-button-wrapper">
              <sl-button variant="primary" size="small" @click=${this.onAddModelClick}>
                <sl-icon slot="prefix" name="plus-circle"></sl-icon>
                Добавить модель
              </sl-button>
            </div>
          ` : nothing}
        </div>

        ${this.isLoading ? html`<sl-spinner label="Загрузка моделей..."></sl-spinner>` : nothing}

        ${!this.isLoading && filteredModels.length === 0 ? html`
          <p style="text-align: center; margin-top: 20px;">Модели не найдены или отсутствуют.</p>
        ` : nothing}

        <div class="grid">
          ${filteredModels.map(model => html`<model-card .model=${model}></model-card>`)}
        </div>
      </div>
    `;
  }
}
