import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BaseElement } from '../../../app/ui/base/base-element';
import type { UserDod, UserRole } from '../../../app/app-domain/dod';
import { USER_ROLE_ICONS, USER_ROLE_TITLES, USER_ROLES } from '../../../app/app-domain/constants';

@customElement('user-card')
export class UserCardEntity extends BaseElement {
    static styles = css`
      :host {
        display: block;
        max-width: 300px;
        margin: 8px;
        font-family: var(--sl-font-sans); /* Более строгий шрифт */
      }

      sl-card::part(base) {
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .name {
        font-size: 1.25rem;
        font-weight: 600;
      }

      img {
        border: 2px solid var(--sl-color-primary-600);
        border-radius: var(--sl-border-radius-medium);
      }

      .info-grid {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 0.5rem 1rem;
        margin-top: 0.5rem;
      }

      .info-label {
        font-weight: 500;
        color: var(--sl-color-neutral-700);
        align-self: start;
      }

      .info-content {
        display: flex;
        flex-wrap: wrap;
        gap: 0.25rem 0.5rem;
      }

      sl-divider {
        margin: 0.5rem 0;
      }
    `;

  @property()
  private user!: UserDod;

  private getTopRole(): UserRole {
    return USER_ROLES.find(role => this.user.roles.includes(role)) ?? USER_ROLES[0];
  }

  render() {
    const topRole = this.getTopRole();
    const avatarUrl = this.user.profile.avatarUrl;
    const skills = Object.keys(this.user.profile.skills ?? {});

    return html`
      <sl-card>
        <img
          slot="image"
          src=${avatarUrl ?? '/assets/icons/' + USER_ROLE_ICONS[topRole] + '.svg'}
          alt="Аватар пользователя"
        />

        <div class="name">${this.user.name}</div>

        <sl-divider></sl-divider>

        <div class="info-grid">
          <div class="info-label">Роли:</div>
          <div class="info-content">
            ${this.user.roles.map(
              role => html`<sl-tag variant="success" size="small">${USER_ROLE_TITLES[role]}</sl-tag>`
            )}
          </div>

          <div class="info-label">Навыки:</div>
          <div class="info-content">
            ${skills.map(skill => html`<sl-tag variant="primary" size="small">${skill}</sl-tag>`)}
          </div>
        </div>
      </sl-card>
    `;
  }
}
