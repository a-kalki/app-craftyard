import { html, css, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { BaseElement } from '#app/ui/base/base-element';
import { markdownUtils } from '#app/ui/utils/markdown';
import type { AppAboutContentType } from '#about/api/use-cases/contract';
import { USER_CONTRIBUTIONS_DETAILS } from '#users/domain/user-contributions/constants';
import type { ImplementedStatus } from '#users/domain/user-contributions/types';

@customElement('about-app')
export class AboutApp extends BaseElement {
  static styles = css`
    :host {
      display: block;
      height: 100%;
      width: 100%;
      overflow-y: auto;
      background-color: var(--sl-color-neutral-50);
    }

    .about-app-container {
      max-width: 960px;
      margin: 0 auto;
      padding: 16px;
    }

    .sticky-header-wrapper {
      position: sticky;
      top: 0;
      z-index: 10;
      background-color: var(--sl-color-neutral-0);
      box-shadow: var(--sl-shadow-small);
      padding-bottom: 8px;
    }

    .app-header {
      padding-left: 16px;
      text-align: left;
      border-bottom: 1px solid var(--sl-color-neutral-200);
      margin-bottom: 8px;
    }

    .app-title {
      padding-left: 16px;
      font-size: 1.6rem;
      font-weight: 700;
      color: var(--sl-color-primary-900);
      margin: 0;
      line-height: 1.2;
      flex-grow: 1;
      flex-shrink: 1;
      min-width: 0;
    }

    .app-description {
      padding: 16px;
      color: var(--sl-color-neutral-600);
      font-size: 1rem;
      max-width: 700px;
      line-height: 1.5;
      margin: 0;
      margin-top: 0.5rem;
    }

    .tabs-container {
      position: sticky;
      top: 100px;
      z-index: 9;
      background-color: var(--sl-color-neutral-0);
      border-bottom: 1px solid var(--sl-color-neutral-200);
      box-shadow: var(--sl-shadow-small);
    }

    sl-tab-group {
      --track-color: transparent;
      --indicator-color: var(--sl-color-primary-600);
      --indicator-border-radius: 0;
      --active-tab-color: var(--sl-color-primary-600);
      --inactive-tab-color: var(--sl-color-neutral-600);
      --focus-ring-width: 0;
      border-bottom: none;
      width: 100%;
    }

    sl-tab-panel {
      padding: 24px 0;
      line-height: 1.7;
      font-size: 1rem;
      color: var(--sl-color-neutral-800);
    }

    .loading-spinner {
      display: block;
      margin: 50px auto;
      font-size: 2.5rem;
    }

    .error-message {
      color: var(--sl-color-danger-600);
      text-align: center;
      padding: 20px;
      font-size: 1.1rem;
    }

    /* Стилизация контента Markdown */
    sl-tab-panel h3 {
      font-size: 1.6rem;
      font-weight: 600;
      color: var(--sl-color-neutral-900);
      margin-top: 1.5em; /* Отступ сверху */
      margin-bottom: 0.8em; /* Отступ снизу */
    }

    sl-tab-panel p {
      margin-bottom: 1em;
      line-height: 1.7;
    }

    sl-tab-panel ul {
      list-style-type: disc;
      padding-left: 2em;
      margin-bottom: 1em;
    }

    sl-tab-panel li {
      margin-bottom: 0.5em;
    }

    sl-tab-panel strong {
      font-weight: 700;
    }

    sl-tab-panel blockquote {
      padding: 1em 1.5em;
      border-left: 5px solid var(--sl-color-neutral-500);
      color: var(--sl-color-neutral-700);
      font-style: italic;
      border-radius: var(--sl-border-radius-medium);
      margin: 0;
      margin-bottom: 1.5rem;
    }

    sl-tab-panel blockquote p {
      margin: 0;
    }

    sl-tab-panel a {
      color: var(--sl-color-primary-600);
      text-decoration: none;
    }

    sl-tab-panel a:hover {
      text-decoration: underline;
    }

    .contributions-container {
      margin-top: 24px;
    }
    
    .filters {
      display: flex;
      gap: 12px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }
    
    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .filter-label {
      font-size: 0.9rem;
      color: var(--sl-color-neutral-600);
    }

    .filter-button {
      position: sticky;
      top: 185px;
      z-index: 20;
      margin-left: auto;
      margin-right: 16px;
      margin-bottom: 8px;
    }

    .filter-dropdown {
      --width: 300px;
    }

    .filter-menu {
      padding: 8px;
    }

    .filter-section {
      padding: 4px 0;
    }

    .filter-section-title {
      font-size: 0.8rem;
      color: var(--sl-color-neutral-500);
      padding: 4px 12px;
      margin-bottom: 4px;
    }
    
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    
    .contribution-card {
      background: var(--sl-color-neutral-0);
      border-radius: var(--sl-border-radius-medium);
      box-shadow: var(--sl-shadow-small);
      padding: 20px;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    
    .contribution-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--sl-shadow-medium);
    }
    
    .card-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }
    
    .card-icon {
      font-size: 1.5rem;
      color: var(--sl-color-primary-600);
    }
    
    .card-title {
      font-size: 1.2rem;
      font-weight: 600;
      margin: 0;
      color: var(--sl-color-neutral-900);
    }
    
    .card-description {
      color: var(--sl-color-neutral-600);
      margin-bottom: 12px;
    }
    
    .card-details {
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid var(--sl-color-neutral-200);
    }
    
    .card-detail {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;
    }
    
    .card-detail-label {
      font-weight: 500;
      color: var(--sl-color-neutral-700);
    }
    
    .card-detail-value {
      color: var(--sl-color-neutral-600);
    }
    
    .status-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: var(--sl-border-radius-small);
      font-size: 0.8rem;
      font-weight: 500;
    }
    
    .status-implemented {
      background-color: var(--sl-color-success-100);
      color: var(--sl-color-success-700);
    }
    
    .status-pending {
      background-color: var(--sl-color-warning-100);
      color: var(--sl-color-warning-700);
    }

    @media (max-width: 768px) {
      :host {
        padding-top: 32px;
      }

      .about-app-container {
        padding: 8px;
      }

      .app-header {
        padding: 0 8px;
        margin-bottom: 4px;
      }

      .app-title {
        padding: 8px;
        font-size: 1.1rem;
      }

      .app-description {
        padding: 8px;
        font-size: 0.8rem;
      }

      .tabs-container {
        top: 0;
        padding: 0 8px;
      }

      sl-tab-panel {
        padding: 16px 0;
      }

      .cards-grid {
        grid-template-columns: 1fr;
      }
      
      .filters {
        flex-direction: column;
      }
    }
  `;

  @state() private activeTab: AppAboutContentType = 'general';
  @state() private contentCache: Map<string, string> = new Map();
  @state() private isLoadingContent: boolean = false;
  @state() private hasError: boolean = false;
  
  @state() private filterTrackingMethod: string = 'all';
  @state() private filterStatus: ImplementedStatus | 'all' = 'all';
  @state() private searchQuery: string = '';

  connectedCallback() {
    super.connectedCallback();
    this.fetchContentForTab(this.activeTab);
  }

  private async fetchContentForTab(tabName: AppAboutContentType) {
    const contentType = tabName;
    if (!contentType) {
      console.error(`Неизвестное имя вкладки: ${tabName}`);
      this.hasError = true;
      return;
    }

    if (this.contentCache.has(tabName)) {
      return;
    }

    this.isLoadingContent = true;
    this.hasError = false;
    try {
      const result = await this.appAboutApi.getContent(contentType);

      if (result.isSuccess()) {
        this.contentCache.set(tabName, result.value);
        this.requestUpdate();
      } else {
        this.app.error('Не удалось загрузить контент для вкладки', { details: result.value });
        this.hasError = true;
      }
    } catch (error) {
      this.app.error('Произошла непредвиденная ошибка при загрузке контента', { details: error });
      this.hasError = true;
    } finally {
      this.isLoadingContent = false;
    }
  }

  private handleTabShow(event: CustomEvent) {
    const newTabName = event.detail.name;
    if (this.activeTab !== newTabName) {
      this.activeTab = newTabName;
      this.fetchContentForTab(newTabName);
    }
  }

  private renderContributionTab() {
    const contributions = Object.entries(USER_CONTRIBUTIONS_DETAILS)
      .sort(([, a], [, b]) => a.orderNumber - b.orderNumber)
      .filter(([, details]) => {
        if (
          this.filterTrackingMethod !== 'all'
          && !details.trackedBy.includes(this.filterTrackingMethod as any)
        ) {
          return false;
        }
        if (this.filterStatus !== 'all' && details.implemented !== this.filterStatus) {
          return false;
        }
        if (this.searchQuery) {
          const query = this.searchQuery.toLowerCase();
          return (
            details.title.toLowerCase().includes(query) ||
            details.description.toLowerCase().includes(query) ||
            details.action.toLowerCase().includes(query) ||
            details.condition.toLowerCase().includes(query)
          );
        }
        return true;
      });

    const statusMap = {
      'implemented': { text: '✅ Реализовано', class: 'status-implemented' },
      'in-progress': { text: '🛠 В разработке', class: 'status-in-progress' },
      'planned': { text: '📅 Запланировано', class: 'status-planned' }
    };

    return html`
      <div class="contributions-container">
        <div class="intro-text">
          ${markdownUtils.parse(this.contentCache.get('contribution')!)}
        </div>
        
        <!-- Новая кнопка фильтра вместо старой панели -->
        <div class="filter-button">
          <sl-dropdown class="filter-dropdown" placement="bottom-end" hoist>
            <sl-button slot="trigger" size="small" variant="neutral" caret>
              <sl-icon name="funnel"></sl-icon>
              Фильтры
            </sl-button>
            <sl-menu class="filter-menu">
              <div class="filter-section">
                <div class="filter-section-title">Метод отслеживания</div>
                <sl-menu-item 
                  type="checkbox"
                  ?checked=${this.filterTrackingMethod === 'all'}
                  @click=${() => this.filterTrackingMethod = 'all'}
                >
                  Все методы
                </sl-menu-item>
                <sl-menu-item 
                  type="checkbox"
                  ?checked=${this.filterTrackingMethod === 'BOT'}
                  @click=${() => this.filterTrackingMethod = 'BOT'}
                >
                  Автоматически (бот)
                </sl-menu-item>
                <sl-menu-item 
                  type="checkbox"
                  ?checked=${this.filterTrackingMethod === 'APP'}
                  @click=${() => this.filterTrackingMethod = 'APP'}
                >
                  Автоматически (приложение)
                </sl-menu-item>
                <sl-menu-item 
                  type="checkbox"
                  ?checked=${this.filterTrackingMethod === 'BOTH'}
                  @click=${() => this.filterTrackingMethod = 'BOTH'}
                >
                  Автоматически (бот+приложение)
                </sl-menu-item>
                <sl-menu-item 
                  type="checkbox"
                  ?checked=${this.filterTrackingMethod === 'MANUAL'}
                  @click=${() => this.filterTrackingMethod = 'MANUAL'}
                >
                  Вручную
                </sl-menu-item>
              </div>
              
              <sl-divider></sl-divider>
              
              <div class="filter-section">
                <div class="filter-section-title">Статус реализации</div>
                <sl-menu-item 
                  type="checkbox"
                  ?checked=${this.filterStatus === 'all'}
                  @click=${() => this.filterStatus = 'all'}
                >
                  Все статусы
                </sl-menu-item>
                <sl-menu-item 
                  type="checkbox"
                  ?checked=${this.filterStatus === 'implemented'}
                  @click=${() => this.filterStatus = 'implemented'}
                >
                  ✅ Реализовано
                </sl-menu-item>
                <sl-menu-item 
                  type="checkbox"
                  ?checked=${this.filterStatus === 'in-progress'}
                  @click=${() => this.filterStatus = 'in-progress'}
                >
                  🛠 В разработке
                </sl-menu-item>
                <sl-menu-item 
                  type="checkbox"
                  ?checked=${this.filterStatus === 'planned'}
                  @click=${() => this.filterStatus = 'planned'}
                >
                  📅 Запланировано
                </sl-menu-item>
              </div>
              
              <sl-divider></sl-divider>
              
              <div class="filter-section">
                <sl-input
                  size="small"
                  placeholder="Поиск по вкладам..."
                  clearable
                  value=${this.searchQuery}
                  @sl-input=${(e: any) => this.searchQuery = e.target.value.toLowerCase()}
                >
                  <sl-icon name="search" slot="prefix"></sl-icon>
                </sl-input>
              </div>
            </sl-menu>
          </sl-dropdown>
        </div>
        
        <div class="cards-grid">
          ${contributions.map(([key, details]) => html`
            <div class="contribution-card">
              <div class="card-header">
                <sl-icon class="card-icon" name=${details.icon}></sl-icon>
                <h3 class="card-title">${details.title}</h3>
              </div>
              
              <p class="card-description">${details.description}</p>
              
              <div class="card-details">
                <div class="card-detail">
                  <span class="card-detail-label">Действие:</span>
                  <span class="card-detail-value">${details.action}</span>
                </div>
                
                <div class="card-detail">
                  <span class="card-detail-label">Условие:</span>
                  <span class="card-detail-value">${details.condition}</span>
                </div>
                
                <div class="card-detail">
                  <span class="card-detail-label">Статус:</span>
                  <span class="status-badge ${statusMap[details.implemented].class}">
                    ${statusMap[details.implemented].text}
                  </span>
                </div>
                
                <div class="card-detail">
                  <span class="card-detail-label">Метод отслеживания:</span>
                  <span class="card-detail-value">
                    ${details.trackedBy.map(method => {
                      switch(method) {
                        case 'BOT': return 'Бот';
                        case 'APP': return 'Приложение';
                        case 'MANUAL': return 'Вручную';
                        case 'BOTH': return 'Бот+Приложение';
                        default: return method;
                      }
                    }).join(', ')}
                  </span>
                </div>
              </div>
            </div>
          `)}
        </div>
        
        ${contributions.length === 0 ? html`
          <div style="text-align: center; padding: 40px; color: var(--sl-color-neutral-500);">
            Ничего не найдено. Попробуйте изменить параметры фильтрации.
          </div>
        ` : nothing}
      </div>
    `;
  }

  render() {
    return html`
      <div class="about-app-container">
        <div class="sticky-header-wrapper">
          <header class="app-header">
            <h1 class="app-title">О проекте "Craftyard" и "Дедок"</h1>
            <p class="app-description">
              Craftyard и Дедок, это не про Стартап, это про Жизнь.<br>
              Мы строим пространство приобретения Мастерства: <strong>Мастерства Жизни</strong>.
            </p>
          </header>

          <div class="tabs-container">
            <sl-tab-group @sl-tab-show=${this.handleTabShow} active-tab=${this.activeTab}>
              <sl-tab slot="nav" panel="about-project">Стартапы</sl-tab>
              <sl-tab slot="nav" panel="actor">Акторы</sl-tab>
              <sl-tab slot="nav" panel="entity">Сущности</sl-tab>
              <sl-tab slot="nav" panel="contribution">Вклады</sl-tab>
              <sl-tab slot="nav" panel="monetization">Монетизация</sl-tab>
              <sl-tab slot="nav" panel="roadmap">Дорожная карта</sl-tab> 
            </sl-tab-group>
          </div>
        </div>

        <main class="app-content">
          ${this.isLoadingContent ? html`<sl-spinner class="loading-spinner" label="Загрузка контента..."></sl-spinner>` : nothing}
          ${this.hasError ? html`<div class="error-message">Не удалось загрузить контент. Пожалуйста, попробуйте еще раз.</div>` : nothing}
          ${!this.isLoadingContent && !this.hasError ? html`
            <sl-tab-panel name="${this.activeTab}" active>
              ${this.activeTab === 'contribution' 
                ? this.renderContributionTab()
                : markdownUtils.parse(this.contentCache.get(this.activeTab) || '')}
            </sl-tab-panel>
          ` : nothing}
        </main>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'about-app': AboutApp;
  }
}
