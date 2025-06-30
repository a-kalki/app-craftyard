import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BaseElement } from '#app/ui/base/base-element';
import type { ThesisSetAttrs } from '#user-contents/domain/thesis-set/struct/attrs';

@customElement('thesis-set-details')
export class ThesisSetDetails extends BaseElement {
  static styles = css`
    :host {
      display: block;
      background: var(--sl-color-white);
      border: 1px solid var(--sl-color-gray-200);
      border-radius: var(--sl-border-radius-medium);
      box-shadow: var(--sl-shadow-x-small);
      padding: 1.5rem;
      margin-bottom: 2rem;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .title-container {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .title {
      font-size: 1.4rem;
      font-weight: 600;
      margin: 0;
    }

    .theses-container {
      display: grid;
      gap: 1.5rem;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
    }

    .action-btn {
      --sl-button-font-size-small: 0.8rem;
      --sl-button-padding-small: 0.3rem 0.5rem;
    }

    @media (min-width: 768px) {
      .theses-container {
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      }
    }
  `;

  @property({ type: Object }) thesisSet!: ThesisSetAttrs;
  @property({ type: Boolean }) canEdit = false;

  protected isLoading = false;

  render() {
    const { title, theses, icon } = this.thesisSet;

    return html`
      <div class="thesis-set">
          <div class="header">
            <div class="title-container">
              ${icon ? html`<sl-icon name=${icon}></sl-icon>` : ''}
              <h2 class="title">${title}</h2>
            </div>
            
            ${this.canEdit ? html`
              <div class="actions">
                <sl-tooltip content="Добавить тезис" placement="bottom">
                  <sl-button 
                    class="action-btn"

                    size="small"
                    @click=${this.handleAddThesis}
                    @contextmenu=${(e: Event) => e.preventDefault()}
                  >
                    <sl-icon name="plus-lg"></sl-icon>
                  </sl-button>
                </sl-tooltip>
                <sl-tooltip content="Редактировать раздел" placement="bottom">
                  <sl-button 
                    class="action-btn"
                    size="small"
                    @click=${this.handleEditThesisSet}
                    @contextmenu=${(e: Event) => e.preventDefault()}
                  >
                    <sl-icon name="pencil"></sl-icon>
                  </sl-button>
                </sl-tooltip>
                <sl-tooltip content="Удалить раздел" placement="bottom">
                  <sl-button 
                    class="action-btn"
                    size="small"
                    variant="danger"
                    @click=${this.handleDeleteThesisSet}
                    @contextmenu=${(e: Event) => e.preventDefault()}
                  >
                    <sl-icon name="trash"></sl-icon>
                  </sl-button>
                </sl-tooltip>
              </div>
            ` : ''}
          </div>

          <div class="theses-container">
            ${theses.map(thesis => html`
              <thesis-card 
                .thesisSetId=${this.thesisSet.id}
                .thesis=${thesis}
                .canEdit=${this.canEdit}
              ></thesis-card>
            `)}
          </div>
      </div>
    `;
  }

  private async handleAddThesis() {
    const modal = document.createElement('add-thesis-modal');
    modal.thesisSetId = this.thesisSet.id;
    
    try {
      this.isLoading = true;
      const newThesisId = await modal.show();
      if (!newThesisId) return;

      this.dispatchEditedEvent();
    } catch (error) {
      this.app.error(`[${this.constructor.name}]: Ошибка при добавлении тезиса.`, { error })
    } finally {
      this.isLoading = false;
    }
  }

  private async dispatchEditedEvent(): Promise<void> {
    const event: CustomEvent<{ id: string }> = new CustomEvent(
      'thesis-set-edited', { detail: { id: this.thesisSet.id } }
    );
    this.dispatchEvent(event);
  }

  private async handleEditThesisSet() {
    const modal = document.createElement('thesis-set-edit-modal');
    document.body.appendChild(modal);
    
    try {
      const result = await modal.show(this.thesisSet);
      if (result) {
        this.dispatchEditedEvent();
      }
    } catch (err) {
      this.app.error('Ошибка при обновлении раздела.');
    }
  }

  private async handleDeleteThesisSet() {
    const confirmed = await this.app.showDialog({
      title: 'Удаление раздела',
      content: 'Вы уверены, что хотите удалить этот раздел? Все тезисы внутри также будут удалены.',
      confirmVariant: 'danger',
      confirmText: 'Удалить',
      cancelText: 'Отмена',
    });
    if (!confirmed) return;

    const deleteResult = await this.thesisSetApi.deleteThesisSet(this.thesisSet.id);
    if (deleteResult.isFailure()) {
      this.app.error(
        'Не удалось удалить раздел.',
        { id: this.thesisSet.id, result: deleteResult.value }
      );
      return;
    }
    this.app.info('Раздел успешно удален.');
    
    this.dispatchEvent(new CustomEvent('thesis-set-deleted', {
      detail: { id: this.thesisSet.id },
    }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'thesis-set-details': ThesisSetDetails;
  }
}
