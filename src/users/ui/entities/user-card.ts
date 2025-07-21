import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { BaseElement } from '../../../app/ui/base/base-element';
import type { UserAttrs } from '#app/domain/user/struct/attrs';
import type { ThesisContent } from '#user-contents/domain/content/struct/thesis-attrs';

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
      display: flex;
      flex-direction: column;
    }

    sl-card::part(header) {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-right: var(--sl-spacing-small);
      gap: var(--sl-spacing-medium);
      flex-wrap: nowrap;
    }

    .header-title {
      font-size: 1.3rem;
      font-weight: 600;
      flex: 1;
      min-width: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .main {
      display: flex;
      width: 100%;
      min-width: 0;
      gap: 1rem;
      flex: 1;
    }

    .avatar-container {
      flex: 0 0 96px;
      max-width: 96px;
      display: flex;
      align-items: flex-start;
    }

    .details {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
    }

    sl-button {
      max-width: 100%;
    }

    .section-title {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--sl-color-neutral-600);
      margin-bottom: 0.3rem;
    }

    .contribution-section {
      margin-top: 0.5rem;
      flex: 1;
    }

    .contribution-list {
      display: flex;
      flex-wrap: wrap;
      gap: var(--sl-spacing-x-small);
      max-width: 100%;
      overflow: hidden;
    }

    .skills-section {
      margin-top: 0.5rem;
    }

    .skills-list {
      display: flex;
      flex-wrap: wrap;
      gap: var(--sl-spacing-x-small);
      max-width: 100%;
      overflow: hidden;
    }

    sl-card::part(footer) {
      padding-top: var(--sl-spacing-medium);
    }
  `;

  @property({ type: Object })
  user!: UserAttrs;

  @state() protected skillContents: ThesisContent[] = [];

  connectedCallback(): void {
    super.connectedCallback();
    this.loadUserSkillContents();
  }

  protected async loadUserSkillContents(): Promise<void> {
    if (!this.userContentApi) {
      console.warn('userContentApi is not available in UserCardEntity.');
      return;
    }

    const contentsResult = await this.userContentApi.getSectionContens(
      this.user.profile.skillsContentSectionId,
    );
    if (contentsResult.isFailure()) {
      this.app.error(
        `[${this.constructor.name}]: Не удалось загрузить данные навыков.`,
        { details: contentsResult.value, skillsSectionId: this.user.profile.skillsContentSectionId }
      );
      return;
    };
    this.skillContents = contentsResult.value.filter(c => c.type === 'THESIS');
  }

  render() {
    const userContributions = this.user.statistics.contributions;
    const contributionKeys = Object.keys(userContributions);
    const activeContributionKeys = contributionKeys.length === 1
      ? contributionKeys
      // @ts-expect-error
      : contributionKeys.filter(key => userContributions[key].count > 0);

    return html`
      <sl-card>
        <div slot="header" class="header">
          <div class="header-title">${this.user.name}</div>
          <sl-tooltip content="Детали" placement="bottom">
            <sl-button @click=${this.navigateToDetails} variant="primary" size="small">
              <sl-icon name="archive"></sl-icon>
            </sl-button>
          </sl-tooltip>
        </div>

        <div class="main">
          <div class="avatar-container">
            <user-avatar .user=${this.user}></user-avatar>
          </div>

          <div class="details">
            <div class="contribution-section">
              <div class="section-title">Вклад:</div>
              <div class="contribution-list">
                ${activeContributionKeys.length === 0
                  ? html`<p>Вклад отсутствует</p>`
                  : activeContributionKeys.map(key => html`
                      <user-contribution-tag
                        .key=${key as keyof typeof activeContributionKeys}
                        .counter=${userContributions[key as keyof typeof userContributions]!}
                      ></user-contribution-tag>
                    `)}
              </div>
            </div>
          </div>
        </div>

        <div slot="footer" class="skills-section">
          <div class="section-title"><strong>Навыки:</strong></div>
          <div class="skills-list">
            ${this.skillContents.length === 0
              ? html`<p>Навыки не указаны</p>`
              : this.skillContents
                  .sort((a, b) => (a.order || 0) - (b.order || 0))
                  .map(content => html`
                    <user-skill-tag .content=${content}></user-skill-tag>
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
