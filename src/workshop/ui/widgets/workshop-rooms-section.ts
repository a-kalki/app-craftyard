import { BaseElement } from "#app/ui/base/base-element";
import type { WorkshopRoom } from "#workshop/domain/struct/attrs";
import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js"; // Use @property

@customElement('workshop-rooms-section')
export class WorkshopRoomsSection extends BaseElement {
  static styles = css`
    .rooms-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); /* Responsive grid for rooms */
      gap: 1.5rem;
    }

    .room-card {
      padding: 0; /* sl-details has internal padding */
      background: var(--sl-color-neutral-50);
      border-radius: var(--sl-border-radius-medium);
      box-shadow: var(--sl-shadow-small);
      border: 1px solid var(--sl-color-neutral-200); /* Add border for card effect */
    }

    .room-card sl-details::part(header) {
      background-color: var(--sl-color-neutral-100);
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--sl-color-primary-700);
      border-radius: var(--sl-border-radius-medium) var(--sl-border-radius-medium) 0 0;
      padding: 1rem;
    }

    .room-card sl-details[open]::part(header) {
      border-bottom: 1px solid var(--sl-color-neutral-200);
    }

    .room-card sl-details::part(content) {
      padding: 1rem;
      background-color: var(--sl-color-neutral-0);
      border-radius: 0 0 var(--sl-border-radius-medium) var(--sl-border-radius-medium);
    }

    .room-description {
      color: var(--sl-color-neutral-600);
      margin-bottom: 1rem;
      line-height: 1.6;
    }

    .machines-title, .workstations-title {
      font-weight: 600;
      margin: 1rem 0 0.5rem;
      color: var(--sl-color-primary-800);
    }

    .tag-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .workstation-item {
        margin-bottom: 1rem;
        border-left: 3px solid var(--sl-color-primary-200);
        padding-left: 1rem;
        background-color: var(--sl-color-neutral-50);
        border-radius: var(--sl-border-radius-small);
        padding: 0.75rem 1rem;
    }

    .workstation-item sl-details::part(header) {
        background-color: transparent;
        padding: 0.5rem 0;
        font-weight: 500;
        font-size: 1rem;
        color: var(--sl-color-neutral-800);
        border-bottom: none;
    }

    .workstation-item sl-details[open]::part(header) {
        border-bottom: none;
    }

    .workstation-item sl-details::part(content) {
        padding: 0.5rem 0;
        border: none;
        background-color: transparent;
    }

    .workstation-description {
        color: var(--sl-color-neutral-700);
        font-size: 0.9rem;
    }
  `;

  @property({ type: Array }) // Changed to @property
  rooms?: WorkshopRoom[];

  render() {
    if (!this.rooms || this.rooms.length === 0) {
      return html`<p>Нет доступных помещений.</p>`;
    }

    return html`
      <div class="rooms-container">
        ${this.rooms.map(room => html`
          <div class="room-card">
            <sl-details summary=${room.title} open>
              <p class="room-description">${room.description}</p>

              ${room.machineList?.length > 0 ? html`
                <div class="machines-title">Доступное оборудование:</div>
                <div class="tag-list">
                  ${room.machineList.map(machine => html`
                    <sl-tag variant="primary">${machine}</sl-tag>
                  `)}
                </div>
              ` : ''}

              ${room.workstations?.length > 0 ? html`
                <div class="workstations-title">Рабочие места:</div>
                ${room.workstations.map(workstation => html`
                  <div class="workstation-item">
                    <sl-details summary=${workstation.title}>
                      <p class="workstation-description">${workstation.description}</p>
                    </sl-details>
                  </div>
                `)}
              ` : ''}
            </sl-details>
          </div>
        `)}
      </div>
    `;
  }
}
