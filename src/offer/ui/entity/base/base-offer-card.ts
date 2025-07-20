import { html, css, nothing, type CSSResultGroup } from 'lit';
import { property } from 'lit/decorators.js';
import { BaseElement } from '#app/ui/base/base-element';
import type { BaseOfferAttrs } from '#offer/domain/base-offer/struct/attrs';
import { costUtils } from '#app/domain/utils/cost/cost-utils';
import { markdownUtils } from '#app/ui/utils/markdown';

interface Action {
  label: string;
  icon: string;
  handler: (e: Event) => void;
  variant?: string;
}

export class BaseOfferCard extends BaseElement {
  static styles: CSSResultGroup = css`
    :host {
      display: block;
      background-color: var(--sl-color-neutral-0);
      border: 1px solid var(--sl-color-neutral-200);
      border-radius: var(--sl-border-radius-medium);
      padding: 1.5rem;
      margin-bottom: 1rem;
      box-shadow: var(--sl-shadow-x-small);
      position: relative;
      overflow: hidden;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.5rem;
    }

    .title-group {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      flex-grow: 1;
      min-width: 0;
    }

    .title {
      font-size: 1.2rem;
      font-weight: 600;
      color: var(--sl-color-primary-800);
      margin: 0;
      line-height: 1.2;
      word-break: break-word;
    }

    /* .actions больше не нужен для кнопок, но оставлю на всякий случай */
    .actions {
      display: flex;
      gap: 0.5rem;
      flex-shrink: 0;
    }

    .status-tag-bottom {
      margin-top: 0.5rem;
    }

    .price-tag {
      margin-top: 0.5rem;
      margin-bottom: 1rem;
    }

    .description {
      font-size: 0.95rem;
      line-height: 1.5;
      color: var(--sl-color-neutral-700);
      margin-bottom: 1rem;
    }
  `;
  @property({ type: Object }) offer!: BaseOfferAttrs;
  @property({ type: Boolean }) canEdit = false;
  @property({ type: Boolean }) showAdminInfo = false;

  /**
   * Возвращает список действий, доступных для этой карточки.
   * Этот метод может быть переопределен в дочерних классах.
   */
  protected _getActions(): Action[] {
    const actions: Action[] = [];

    if (this.canEdit) {
      actions.push({
        label: 'Редактировать',
        icon: 'pencil',
        handler: this.handleEditClick.bind(this),
      });
      actions.push({
        label: 'Удалить',
        icon: 'trash',
        handler: this.handleDeleteClick.bind(this),
        variant: 'danger',
      });
    }
    return actions;
  }

  protected renderActions() {
    const availableActions = this._getActions();

    if (availableActions.length === 0) {
      return nothing;
    }

    const mainAction = availableActions[0]; // Первая кнопка всегда основное действие

    return html`
      <sl-button-group>
        <sl-button
          size="small"
          variant="primary"
          @click=${mainAction.handler}
        >
          <sl-icon name=${mainAction.icon}></sl-icon>
        </sl-button>

        ${availableActions.length > 1 ? html`
          <sl-dropdown placement="bottom-end" hoist>
            <sl-button size="small" slot="trigger" variant="primary" caret></sl-button>
            <sl-menu>
              ${availableActions.map(action => html`
                <sl-menu-item @click=${action.handler}>
                  <sl-icon slot="prefix" name=${action.icon}></sl-icon>
                  ${action.label}
                </sl-menu-item>
              `)}
            </sl-menu>
          </sl-dropdown>
        ` : nothing}
      </sl-button-group>
    `;
  }

  protected handleEditClick() {
    this.app.error('Редактирование пока не реализовано.');
    console.log('Edit offer:', this.offer.id);
  }

  protected async handleDeleteClick(): Promise<void> {
    const confirm = await this.app.showDialog({
      title: 'Удаление предложения',
      content: 'Вы действительно хотите удалить предложение?',
      confirmText: 'Удалить',
      confirmVariant: 'danger',
    });
    if (!confirm) return;

    const result = await this.offerApi.deleteOffer(this.offer.id);
    if (result.isFailure()) {
      this.app.error(
        'Не удалось удалить предложение',
        { result: result.value },
      );
    }
    this.dispatchEvent(new CustomEvent(
      'offer-deleted',
      { detail: { offerId: this.offer.id } },
    ));
  }

  protected getStatusVariant(status: string) {
    switch (status) {
      case 'active': return 'success';
      case 'pending_moderation': return 'warning';
      case 'archived': return 'neutral';
      default: return 'neutral';
    }
  }

  protected getStatusText(status: string) {
    switch (status) {
      case 'active': return 'Активно';
      case 'pending_moderation': return 'На модерации';
      case 'archived': return 'Архив';
      default: return status;
    }
  }

  render() {
    const isStatusActive = this.offer.status === 'active';

    return html`
      <div class="card-header">
        <div class="title-group">
          <h3 class="title">${this.offer.title}</h3>
          ${!isStatusActive && this.showAdminInfo ? html`
            <sl-tag
              class="status-tag-bottom"
              variant=${this.getStatusVariant(this.offer.status)}
              size="small"
            >
              ${this.getStatusText(this.offer.status)}
            </sl-tag>
          ` : nothing}
        </div>
        ${this.renderActions()}
      </div>

      ${this.renderAfterHeader()}
      
      <sl-tag
        class="price-tag"
        variant="success"
        size="large"
      >
        ${costUtils.toString(this.offer.cost)}
      </sl-tag>

      <div class="description">
        ${markdownUtils.parse(this.offer.description.replace(/\\n/g, '\n'))}
      </div>
      
      ${this.renderSpecificDetails()}
    `;
  }

  protected renderAfterHeader(): unknown {
    return nothing;
  }

  protected renderSpecificDetails(): unknown {
    return nothing;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'base-offer-card': BaseOfferCard;
  }
}
