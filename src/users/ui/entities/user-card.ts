import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BaseElement } from '../../../app/ui/base/base-element';
import type { UserDod } from '../../../app/app-domain/dod';
import { USER_ROLE_DESCRIPTIONS, USER_ROLE_TITLES, USER_ROLE_ICONS } from '../../../app/app-domain/constants';

@customElement('user-card')
export class UserCardEntity extends BaseElement {
  static styles = css`
    :host {
      display: block;
      max-width: 350px;
      margin: 8px;
      font-family: var(--sl-font-sans);
    }

    sl-card::part(base) {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .top-section {
      display: flex;
      gap: 1rem;
    }

    .details {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .roles-section {
      margin-top: 0.5rem;
    }

    .roles-title {
      font-size: 0.875rem;
      color: var(--sl-color-neutral-600);
      margin-bottom: 0.25rem;
    }

    .roles-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .actions {
      display: flex;
      justify-content: flex-end;
    }

    .name {
      font-size: 1.25rem;
      font-weight: 600;
    }

    .skills-section {
      margin-top: 0.5rem;
    }
  `;

  @property({ type: Object })
  user!: UserDod;

  render() {
    const skills = Object.keys(this.user.profile.skills ?? {});

    return html`
      <sl-card>
        <div slot="header" class="name">${this.user.name}</div>
        <div class="top-section">
          <user-avatar .user=${this.user} size="150"></user-avatar>
          <div class="details">
            <div class="actions">
              <sl-button
                variant="primary"
                size="medium"
                @click=${(e: MouseEvent) => this.navigateToDetails(e)}>
                <sl-icon name="ticket-detailed"></sl-icon>
                Подробнее
              </sl-button>
            </div>
            <div class="roles-section">
              <div class="roles-title"><strong>Роли:</strong></div>
              <div class="roles-list">
                ${this.user.roleCounters.map(
                  role => html`
                    <role-tag
                      .role=${role}
                      .title=${USER_ROLE_TITLES[role]}
                      .description=${USER_ROLE_DESCRIPTIONS[role]}
                      .icon=${USER_ROLE_ICONS[role]}
                    ></role-tag>
                  `
                )}
              </div>
            </div>
          </div>
        </div>

        <div slot="footer" class="skills-section">
          <div class="roles-title"><strong>Навыки:</strong></div>
          <div>
            ${skills.length === 0
              ? html`<p>Навыки не указаны</p>`
              : skills.map(skill => html`
                <sl-tag variant="primary" size="small">${skill}</sl-tag>
              `)}
          </div>
        </div>
      </sl-card>
    `;
  }

  private navigateToDetails(e: MouseEvent): void {
    e.preventDefault();
    this.app.router.navigate(`/users/${this.user.id}`);
  }
}
