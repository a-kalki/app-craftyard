import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BaseElement } from '../../../app/ui/base/base-element';
import { UserAr } from '#app/domain/user/a-root';
import type { UserAttrs } from '#app/domain/user/struct/attrs';

@customElement('user-card')
export class UserCardEntity extends BaseElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
      contain: content;
      min-width: 0;
    }

    sl-card {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      overflow: hidden;
    }

    .main {
      display: flex;
      width: 100%;
      min-width: 0;
      gap: 1rem;
    }

    .header {
      font-size: 1.3rem;
      font-weight: 600;
    }

    .avatar-container {
      flex: 0 0 120px;
      max-width: 120px;
    }

    .details {
      flex: 1;
      min-width: 0;
    }

    .actions {
      width: 100%;
    }

    sl-button {
      max-width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .section-title {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--sl-color-neutral-600);
      margin-bottom: 0.3rem;
    }

    .contribution-section {
      margin-top: 0.5rem;
    }

    .contribution-list, .skills-section {
      max-width: 100%;
      overflow: hidden;
    }

    .skills-section {
      margin-top: 0.5rem;
    }
  `;

  @property({ type: Object })
  user!: UserAttrs;

  render() {
    const userAR = new UserAr(this.user);
    const skills = Object.keys(userAR.getSkills());
    const contributionKeys = userAR.getContributionKeys();

    return html`
      <sl-card>
        <div slot="header" class="header">${this.user.name}</div>

        <div class="main">
          <div class="avatar-container">
            <user-avatar .user=${this.user}></user-avatar>
          </div>

          <div class="details">
            <div class="actions">
              <sl-button @click=${this.navigateToDetails} variant="primary" size="medium">
                <sl-icon name="ticket-detailed"></sl-icon> Подробнее
              </sl-button>
            </div>
            <div class="contribution-section">
              <div class="section-title">Статусы:</div>
              <div class="contribution-list">
                ${contributionKeys.map(s => html`<user-contribution-tag .contributionKey=${s}></user-contribution-tag>`)}
              </div>
            </div>
          </div>
        </div>

        <div slot="footer" class="skills-section">
          <div class="section-title"><strong>Навыки:</strong></div>
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
