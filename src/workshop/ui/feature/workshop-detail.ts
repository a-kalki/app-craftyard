import { html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { BaseElement } from '../../../app/ui/base/base-element';
import type { BackendResultByMeta } from 'rilata/core';
import type { WorkshopAttrs } from '#workshop/domain/struct/attrs';
import type { GetWorkshopMeta } from '#workshop/domain/struct/get-workshop/contract';

@customElement('workshop-details')
export class WorkshopDetailsEntity extends BaseElement {
  static styles = css`
    :host {
      display: block;
      max-width: 1000px;
      margin: 8px auto;
      padding: 16px;
      background: var(--sl-color-neutral-0);
      border-radius: var(--sl-border-radius-medium);
      box-shadow: var(--sl-shadow-large);
      font-family: var(--sl-font-sans);
    }

    .header {
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
      margin-bottom: .6rem;
    }

    .logo-container {
      width: 120px;
      height: 120px;
      border-radius: var(--sl-border-radius-medium);
      overflow: hidden;
      background: var(--sl-color-neutral-100);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .logo {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }

    .workshop-info {
      flex: 2;
      min-width: 250px;
    }

    .name {
      font-size: 1.8rem;
      font-weight: 700;
      color: var(--sl-color-primary-900);
      margin-bottom: 0.5rem;
    }

    .location {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.1rem;
      color: var(--sl-color-neutral-700);
      margin-bottom: 1rem;
    }

    .description {
      color: var(--sl-color-neutral-600);
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }

    @media (max-width: 600px) {
      .header {
        flex-direction: column;
      }
      
      .logo-container {
        width: 100%;
        height: auto;
        aspect-ratio: 1/1;
      }
    }
  `;

  static routingAttrs = {
    pattern: '/workshops/:workshopId',
    tag: 'workshop-details',
  };

  @state()
  private workshop: WorkshopAttrs | null = null;

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
  }

  render() {
    if (!this.workshop) {
      return html`<sl-spinner label="Загрузка мастерской..." style="width:48px; height:48px;"></sl-spinner>`;
    }

    return html`
      <div class="header">
        ${this.workshop.about.logo ? html`
          <div class="logo-container">
            <img src=${this.workshop.about.logo} alt="Логотип ${this.workshop.title}" class="logo">
          </div>
        ` : ''}
        
        <div class="workshop-info">
          <h1 class="name">${this.workshop.title}</h1>
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
