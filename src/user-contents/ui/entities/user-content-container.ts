import { html, css, type TemplateResult, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { type OwnerAggregateAttrs } from 'rilata/api-server';
import { BaseElement } from '#app/ui/base/base-element';
import type { ThesisSetAttrs } from '#user-contents/domain/thesis-set/struct/attrs';
import type { GetThesisSetContentCommand } from '#user-contents/domain/thesis-set/struct/thesis-set/get-content';
import { markdownUtils } from '#app/ui/utils/markdown';
import { keyboardUtils } from '#app/ui/utils/keyboard';

@customElement('user-content-container')
export class UserContentContainer extends BaseElement {
  static styles = css`
  :host {
    display: block;
    width: 100%;
    position: relative;
  }

  .container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background: var(--sl-color-gray-50);
    border: 1px dashed var(--sl-color-gray-200);
    border-radius: var(--sl-border-radius-medium);
    padding: 16px;
    position: relative;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 0px 0px 16px;
  }

  .title {
    margin: 0;
    font-size: 1.5rem;
    color: var(--sl-color-gray-800);
  }

  .menu-trigger {
    position: relative;
    margin-left: 1rem;
    margin-right: 0.5rem;
  }

  sl-icon {
    color: var(--sl-color-primary-600);
    font-size: 1.2rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border: 2px solid var(--sl-color-primary-600);
    border-radius: 4px;
    background: none;
    padding: 0.15rem;
    transition: background-color 0.2s ease;
  }

  sl-icon:hover {
    background: rgba(37, 99, 235, 0.1);
    border-radius: 4px;
  }

  .menu-content {
    display: none;
    position: absolute;
    top: 100%;
    right: 0;
    background: white;
    border-radius: var(--sl-border-radius-medium);
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    min-width: 200px;
    z-index: 110;
  }

  .menu-trigger[open] .menu-content {
    display: block;
  }

    sl-menu-item::part(base) {
      padding: 0.75rem 1rem;
    }

    sl-menu-item sl-icon {
      font-size: 1rem;
      padding: 0;
    }

    .empty-state {
      padding: 16px;
    }

    .empty-state sl-icon {
      width: 16px;
      height: 16px;
    }

    .empty-state .title {
      font-weight: bold;
      font-size: 1.2rem;
    }

    .empty-state .instruction {
      display: flex;
      align-items: center;
      gap: 0.3rem;
      white-space: nowrap;
    }

    .empty-state .instruction sl-icon {
      border: 2px solid var(--sl-color-primary-600);
      border-radius: 4px;
      padding: 0.15rem;
      font-size: 0.8rem;
      vertical-align: middle;
    }

    .empty-state p {
      margin: 0.5rem 0;
      font-size: 1.1rem;
    }

  `;

  @property({ type: String }) title = '';
  @property({ type: Object }) ownerAttrs!: OwnerAggregateAttrs;
  @property({ type: Boolean }) canEdit = false;
  @state() private thesisSets: ThesisSetAttrs[] = [];
  @state() private isLoading = false;
  @state() private menuOpen = false;

  protected newContent?: { title?: string; body?: string };

  connectedCallback() {
    super.connectedCallback();
    if (!this.ownerAttrs) {
      throw new Error(`[${this.constructor.name}] Неверная инициализация компонента`);
    }
    this.loadThesisSets();
  }

  private toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  private closeMenu() {
    this.menuOpen = false;
  }

  async loadThesisSets() {
    this.isLoading = true;
    try {
      const result = await this.thesisSetApi.getOwnerArThesisSet(this.ownerAttrs.ownerId);
      if (result.isFailure()) {
        this.app.error(
          'Не удалось загрузить пользовательский контент.',
          { ownerAttrs: this.ownerAttrs, result },
        );
        return;
      }
      this.thesisSets = result.value.filter(ts => ts.context === this.ownerAttrs.context);
      if (this.thesisSets.length === 0 && this.canEdit) {
        await this.loadDefaultContent();
      }
      this.sortThesisSets();
    } catch (error) {
      this.app.error(
        'Ошибка при загрузке пользовательского контента.',
        { ownerAttrs: this.ownerAttrs, errMsg: (error as Error).message },
      );
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  private sortThesisSets() {
    this.thesisSets = [...this.thesisSets].sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  protected async loadDefaultContent(): Promise<void> {
    const getContentCommand: GetThesisSetContentCommand['attrs'] = {
      ownerAggregateAttrs: this.ownerAttrs,
      contentType: 'empty-container',
    };
    const result = await this.thesisSetApi.getContent(getContentCommand);
    this.newContent = result.isSuccess()
      ? result.value
      : undefined;
  }

  private async handleAddThesisSet() {
    this.closeMenu();
    const modal = document.createElement('add-thesis-set-modal');
    modal.ownerAttrs = this.ownerAttrs;

    try {
      const newThesisSetId = await modal.show();
      if (!newThesisSetId) return;

      const getResult = await this.thesisSetApi.getThesisSet(newThesisSetId);
      if (getResult.isFailure()) {
        this.app.error(`Не удалось создать новый раздел: ${getResult.value}`, { result: getResult });
        return;
      }
      this.thesisSets = [...this.thesisSets, getResult.value];
      this.sortThesisSets();
    } catch (error) {
      console.error('Failed to create thesis set:', error);
      this.app.error('Ошибка при создании раздела.', { error });
    }
  }

  private async handleThesisSetEdited(editedId: string) {
    const getResult = await this.thesisSetApi.getThesisSet(editedId, true);
    if (getResult.isFailure()) {
      this.app.error(`[${this.constructor.name}]: Не удалось загрузить данные о разделе.`, {
        id: editedId, result: { status: false, value: getResult.value }
      })
      return;
    }
    const updated = getResult.value;
    this.thesisSets = this.thesisSets.map(ts => 
      ts.id === updated.id ? updated : ts
    );
    this.sortThesisSets();
  }

  private handleThesisSetDelete(deletedId: string) {
    this.thesisSets = this.thesisSets.filter(ts => ts.id !== deletedId);
  }

  render() {
    if (this.isLoading) {
      return html`<sl-spinner></sl-spinner>`;
    }

    if (!this.canEdit && this.thesisSets.length === 0) {
      return html`<div style="display: none"></div>`;
    }

    return html`
      <div class="container">
        ${this.renderHeader()}

        ${this.thesisSets.length === 0
          ? this.renderEmptyContainer()
          : this.thesisSets.map(thesisSet => html`
            <thesis-set-details
              .thesisSet=${thesisSet}
              .canEdit=${this.canEdit}
              @thesis-set-edited=${(e: CustomEvent<{ id: string }>) => 
                this.handleThesisSetEdited(e.detail.id)}
              @thesis-set-deleted=${(e: CustomEvent<{id: string}>) => 
                this.handleThesisSetDelete(e.detail.id)}
            ></thesis-set-details>
          `)
        }
      </div>
    `;
  }

  protected renderHeader(): TemplateResult {
    return html`
      <div class="header">
        <h2 class="title">${this.title || nothing}</h2>
        ${this.canEdit ? html`
          <div class="menu-trigger" ?open=${this.menuOpen}>
            <sl-icon 
              name="three-dots-vertical"
              label="Меню"
              tabindex="0"
              @click=${this.toggleMenu}
              @keydown=${(e: KeyboardEvent) => this.handleKeyAction(e, () => this.toggleMenu())}
            ></sl-icon>
            
            ${this.menuOpen ? html`
              <div class="menu-content" @click=${(e: Event) => e.stopPropagation()}>
                <sl-menu>
                  <sl-menu-item 
                    @click=${this.handleAddThesisSet}
                    @keydown=${(e: KeyboardEvent) => this.handleKeyAction(e, () => this.handleAddThesisSet())}
                  >
                    <sl-icon name="plus" slot="prefix"></sl-icon>
                    Добавить раздел
                  </sl-menu-item>
                </sl-menu>
              </div>
            ` : ''}
          </div>
        ` : ''}
      </div>
    `;
  }

  private handleKeyAction(e: KeyboardEvent, action: () => void) {
    if (keyboardUtils.isActionKey(e)) {
      e.preventDefault();
      action();
    }
  }


  protected renderEmptyContainer(): TemplateResult {
    const title = this.newContent?.title ?? 'Пока нет ни одного раздела';
    const body = this.newContent?.body ?? 'Создайте свой первый раздел, чтобы начать добавлять контент используя разметку markdown.';
    return html`
      <div class="empty-state">
        ${markdownUtils.parseWithClasses(title, 'title')}
        ${markdownUtils.parse(body)}
        <p class="instruction">Чтобы добавить раздел нажмите кнопку: <sl-icon name="three-dots-vertical"></sl-icon> на правом верхнем углу</p>
      </div>
    `;
  }
}
