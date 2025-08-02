import { html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BaseElement } from '#app/ui/base/base-element';
import type { WorkshopAttrs } from '#workshop/domain/struct/attrs';

@customElement('workshop-header')
export class WorkshopHeader extends BaseElement {
  @property({ type: Object }) workshop!: WorkshopAttrs;
  @property({ type: String }) activePage: 'details' | 'offers' = 'details';
  @property({ type: Boolean }) canEdit = false;

  static styles = css`
    :host {
      display: block;
      padding: 16px;
      background-color: var(--sl-color-neutral-0);
      border-bottom: 1px solid var(--sl-color-neutral-200);
    }

    .header-content-grid {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 1.5rem;
      align-items: center;
    }

    .logo-container {
      width: 96px;
      height: 96px;
      border-radius: var(--sl-border-radius-medium);
      overflow: hidden;
      background: var(--sl-color-neutral-100);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .logo {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }

    .workshop-info {
      display: flex;
      flex-direction: column;
      min-width: unset;
    }

    .name-and-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      margin-bottom: 0.5rem;
    }

    .name {
      font-size: 1.6rem;
      font-weight: 700;
      color: var(--sl-color-primary-900);
      margin: 0;
      line-height: 1.2;
      flex-grow: 1;
      flex-shrink: 1;
      min-width: 0;
    }

    .location {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.1rem;
      color: var(--sl-color-neutral-700);
      margin-bottom: 0.8rem;
    }

    .description {
      color: var(--sl-color-neutral-600);
      line-height: 1.5;
      margin-bottom: 0;
      font-size: 0.95rem;
    }

    .header-actions {
      display: flex;
      flex-direction: row;
      align-items: center;
      flex-shrink: 0;
      min-width: fit-content;
    }

    .header-actions sl-button-group sl-button {
      white-space: nowrap;
      --sl-button-size-medium: 36px;
      font-size: 0.875rem;
    }

    sl-dropdown::part(panel) {
      z-index: 100;
    }

    /* Медиа-запросы для мобильных устройств */
    @media (max-width: 768px) {
      .header-content-grid {
        gap: 1rem;
      }

      .logo-container {
        width: 64px;
        height: 64px;
      }

      .name {
        font-size: 1.2rem;
        line-height: 1.3;
      }

      .location {
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
      }

      .description {
        font-size: 0.85rem;
        line-height: 1.4;
      }
    }
  `;

  private navigateToOtherPage() {
    if (!this.workshop) return;

    const workshopId = this.workshop.id;
    if (this.activePage === 'details') {
      this.app.router.navigate(`/workshops/${workshopId}/offers`);
    } else {
      this.app.router.navigate(`/workshops/${workshopId}`);
    }
  }

  private async openEditWorkshopModal() {
    this.app.error('Модалка редактирования мастерской пока не реализована.');
    console.log('Open edit workshop modal for:', this.workshop?.id);
  }

  render() {
    if (!this.workshop) {
      return html`
        <div class="header-content-grid">
          <div style="grid-column: 1 / -1; text-align: center; padding: 20px;">
            <sl-spinner style="width:48px; height:48px; display: inline-block;" label="Загрузка мастерской..."></sl-spinner>
          </div>
        </div>
      `;
    }

    const navButtonText = this.activePage === 'details' ? 'Офферы мастерской' : 'О мастерской';
    const navButtonIcon = this.activePage === 'details' ? 'check2-square' : 'info-square';

    return html`
      <div class="header-content-grid">
        ${this.workshop.about.logo ? html`
          <div class="logo-container">
            <img src=${this.workshop.about.logo} alt="Логотип ${this.workshop.title}" class="logo">
          </div>
        ` : nothing}
        
        <div class="workshop-info">
          <div class="name-and-actions">
            <h1 class="name">${this.workshop.title}</h1>
            <div class="header-actions">
              <sl-button-group>
                <sl-tooltip content=${navButtonText} placement="left">
                  <sl-button size="small" variant="primary" @click=${this.navigateToOtherPage}>
                    <sl-icon slot="prefix" name=${navButtonIcon}></sl-icon>
                  </sl-button>
                </sl-tooltip>
                ${this.canEdit ? html`
                  <sl-dropdown placement="bottom-end" hoist>
                    <sl-button size="small" slot="trigger" variant="primary" caret>
                    </sl-button>
                    <sl-menu>
                      <sl-menu-item variant="primary" @click=${this.navigateToOtherPage}>
                        <sl-icon slot="prefix" name=${navButtonIcon}></sl-icon>
                        ${navButtonText}
                      </sl-menu-item>
                      <sl-menu-item variant="primary" @click=${this.openEditWorkshopModal}>
                        <sl-icon slot="prefix" name="pencil"></sl-icon>
                        Редактировать
                      </sl-menu-item>
                    </sl-menu>
                  </sl-dropdown>
                ` : nothing}
              </sl-button-group>
            </div>
          </div>
          
          <div class="location">
            <sl-icon name="geo-alt"></sl-icon>
            <span>${this.workshop.about.location}</span>
          </div>
          <p class="description">${this.workshop.description}</p>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'workshop-header': WorkshopHeader;
  }
}
