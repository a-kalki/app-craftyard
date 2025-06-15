import { html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { BaseElement } from '../../../app/ui/base/base-element';
import { workshopsApi } from '../workshops-api';
import type { BackendResultByMeta } from 'rilata/core';
import type { WorkshopAttrs } from '#workshop/domain/struct/attrs';
import type { GetWorkshopMeta } from '#workshop/domain/struct/get-workshop';
import { CONTRIBUTIONS_DETAILS } from '#app/domain/contributions/constants';

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

    sl-divider {
      margin: .6rem 0;
    }

    sl-details {
      margin-bottom: .6rem;
      border: 1px solid var(--sl-color-neutral-200);
      border-radius: var(--sl-border-radius-medium);
      box-shadow: var(--sl-shadow-small);
      background: var(--sl-color-neutral-0);
    }

    sl-details::part(header) {
      padding: 1rem;
      font-weight: 600;
      font-size: 1.25rem;
      color: var(--sl-color-primary-800);
      display: flex;
      align-items: center;
      gap: 0.75rem;
      border-bottom: 1px solid var(--sl-color-neutral-200);
      background-color: var(--sl-color-neutral-50);
      border-radius: var(--sl-border-radius-medium) var(--sl-border-radius-medium) 0 0;
    }

    sl-details[open]::part(header) {
        border-bottom: 1px solid var(--sl-color-neutral-200);
    }

    sl-details::part(content) {
      padding: 1rem;
      background-color: var(--sl-color-neutral-0);
      border-radius: 0 0 var(--sl-border-radius-medium) var(--sl-border-radius-medium);
    }

    sl-details::part(summary-icon) {
        font-size: 1.25rem; /* Icon size for summary */
    }

    .section-title {
      font-size: 1.2rem;
      font-weight: 600;
      color: var(--sl-color-primary-800);
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .section-title sl-icon {
      font-size: 1.25rem;
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
    const workshopId = this.getWorkshopId();
    const result = await this.loadWorkshop(workshopId);
    if (result.isFailure()) {
      this.app.error('Не удалось загрузить данные мастерской', {
        workshopId,
        description: 'Мастерской с таким id не существует'
      });
      return;
    }
    this.workshop = result.value;
  }

  protected getWorkshopId(): string {
    return this.app.router.getParams().workshopId;
  }

  private async loadWorkshop(workshopId: string): Promise<BackendResultByMeta<GetWorkshopMeta>> {
    return workshopsApi.getWorkshop(workshopId);
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

      <sl-divider></sl-divider>

      ${this.workshop.about.customContent?.length ? html`
        <sl-details>
          <div slot="summary" class="section-title">
            <sl-icon name="info-circle"></sl-icon>
            Дополнительная информация
          </div>
          <workshop-basic-info .customContent=${this.workshop.about.customContent}></workshop-basic-info>
        </sl-details>

        <sl-divider></sl-divider>
      ` : ''}

      <sl-details>
        <div slot="summary" class="section-title">
          <sl-icon name="gear-wide-connected"></sl-icon>
          О мастерской
        </div>
        <workshop-rooms-section .rooms=${this.workshop.rooms}></workshop-rooms-section>
      </sl-details>
      <sl-divider></sl-divider>

      <sl-details>
        <div slot="summary" class="section-title">
          <sl-icon name="${CONTRIBUTIONS_DETAILS['HOBBIST'].icon}"></sl-icon>
          Для хоббистов
        </div>
        <workshop-hobbyists-section .plans=${this.workshop.subscriptionPlans}></workshop-hobbyists-section>
      </sl-details>
      <sl-divider></sl-divider>

      <sl-details>
        <div slot="summary" class="section-title">
          <sl-icon name="${CONTRIBUTIONS_DETAILS['MAKER'].icon}"></sl-icon>
          Для мастеров и менторов
        </div>
        <workshop-masters-section 
          .commissionStrategy=${this.workshop.commissionStrategy}
          .individualCommissions=${this.workshop.individualCommissions}
        ></workshop-masters-section>
      </sl-details>
    `;
  }
}
