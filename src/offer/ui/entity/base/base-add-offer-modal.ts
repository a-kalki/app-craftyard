import { html, css, type TemplateResult, type CSSResultGroup } from 'lit';
import { property, state } from 'lit/decorators.js';
import { ValidatableElement } from '#app/ui/base/validatable-element';
import type { AddModelOfferModalDialog } from './types';
import type { AddOfferCommand } from '#offer/domain/crud/add-offer/contract';
import type { OfferTypes } from '#offer/domain/types';
import type { CooperationAttrs } from '#cooperation/domain/types';
import type { CooperationContextType, CooperationNodeAttrs } from '#cooperation/domain/base/node/struct/attrs';
import type { LiteralDataType, LiteralFieldValidator } from 'rilata/validator';
import { costVmap } from '#app/domain/v-map';
import type { Cost } from '#app/domain/types';
import type { UserAttrs } from '#app/domain/user/struct/attrs';
import type { WorkshopAttrs } from '#workshop/domain/struct/attrs';
import type { ModelAttrs } from '#models/domain/struct/attrs';

export abstract class BaseAddOfferModal<T extends AddOfferCommand['attrs']>
  extends ValidatableElement<T>
  implements AddModelOfferModalDialog
{
  static styles: CSSResultGroup = css`
    sl-dialog::part(panel) {
      width: min(90vw, 800px);
      max-height: 90vh;
      display: flex;
      flex-direction: column;
    }

    sl-dialog::part(body) {
      flex-grow: 1;
      overflow-y: auto;
    }

    .editor-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1rem 0;
    }

    .error {
      color: var(--sl-color-danger-600);
      font-size: 0.875rem;
      margin-top: -0.5rem;
    }

    sl-dialog::part(footer) {
      display: flex;
      justify-content: flex-end;
      gap: var(--sl-spacing-medium);
      padding-top: var(--sl-spacing-medium);
    }
  `;

  @property({ type: Boolean, reflect: true }) open = false;

  protected offerType!: OfferTypes;

  @state() protected isLoading = false;
  @state() protected formData!: T;
  @state() protected workshopCooperations!: CooperationAttrs[];
  @state() protected modelAttrs: ModelAttrs | null = null;

  protected master: UserAttrs | null = null;
  protected workshop: WorkshopAttrs | null = null;

  private resolve?: (result: { offerId: string } | null) => void;

  protected abstract createDefaultOfferAttrs(): Partial<T>;

  protected abstract renderSpecificFields(): TemplateResult;

  /** Показывает модальное окно. */
  async show(offerType: OfferTypes, secondArg: unknown): Promise<{ offerId: string } | null> {
    this.master = this.app.assertAuthUser();
    if (!this.master) return Promise.resolve(null);

    if (offerType === 'WORKSPACE_RENT_OFFER') {
      this.workshop = secondArg as WorkshopAttrs;
    } else {
      this.workshop = this.app.assertUserWorkshop();
      if (!this.workshop) return Promise.resolve(null);
      this.modelAttrs = secondArg as ModelAttrs;
    }

    this.offerType = offerType;
    this.formData = this.createDefaultOfferAttrs() as T;

    this.isLoading = true;
    const loadResult = await this.loadCooperations();
    if (!loadResult) return Promise.resolve(null);

    this.open = true;
    this.isLoading = false;

    if (!document.body.contains(this)) {
      document.body.appendChild(this);
    }

    return new Promise((resolve) => {
      this.resolve = resolve;
    });
  }

  async loadCooperations(): Promise<boolean> {
    const result = await this.cooperationApi.getWorkshopCooperations(this.workshop!.id);
    if (result.isFailure()) {
      this.app.error(
        `[${this.constructor.name}]: Не удалось загрузить данные кооперации.`,
        result.toObject(),
      );
      return false;
    }
    this.workshopCooperations = result.value.filter(c => c.type === 'OFFER_COOPERATION');
    return true;
  }

  protected async save() {
    if (!this.validateAll()) {
      this.app.error('Необходимо ввести корректные данные.', { errors: this.fieldErrors });
      return;
    }
    this.isLoading = true;

    try {
      const commandAttrs: AddOfferCommand['attrs'] = this.formData;
      const addResult = await this.offerApi.addOffer(commandAttrs);

      if (addResult.isFailure()) {
        this.app.error(`Не удалось добавить предложение.`, {
          attrs: this.formData, result: addResult.value,
        });
        return;
      }

      if (this.resolve) {
        this.resolve({ offerId: addResult.value.id });
      }
      this.hide();
    } catch (err) {
      this.app.error(`Ошибка при добавлении предложения`, {
        attrs: this.formData, error: err
      });
    } finally {
      this.isLoading = false;
    }
  }

  protected hide() {
    this.open = false;
    if (this.resolve) {
      this.resolve(null);
      this.resolve = undefined;
    }
    if (document.body.contains(this)) {
      document.body.removeChild(this);
    }
  }

  render() {
    return html`
      <sl-dialog
        label=${`Добавление предложения: ${this.getOfferTypeDisplayName(this.offerType)}`}
        ?open=${this.open}
        @sl-request-close=${this.hide}
      >
        <div class="editor-container">
          ${this.renderCommonFields()}
          ${this.renderSpecificFields()}
        </div>

        <sl-button slot="footer" @click=${this.hide} ?disabled=${this.isLoading}>Отмена</sl-button>
        <sl-button 
          slot="footer" 
          variant="primary" 
          ?disabled=${!this.validateAll()}
          @click=${this.save}
          ?loading=${this.isLoading}
        >
          Создать
        </sl-button>
      </sl-dialog>
    `;
  }

  protected renderCommonFields(): TemplateResult {
    return html`
      <sl-input
        label="Заголовок предложения"
        help-text="Основное название предложения"
        .value=${this.formData.title ?? ''}
        @sl-input=${this.createValidateHandler('title')}
      ></sl-input>
      ${this.renderFieldErrors('title')}

      <sl-textarea
        label="Описание (Markdown)"
        help-text="Подробное описание предложения"
        rows=5
        .value=${this.formData.description ?? ''}
        @sl-input=${this.createValidateHandler('description')}
      ></sl-textarea>
      ${this.renderFieldErrors('description')}

      <sl-input
        label="Цена"
        type="number"
        min="0"
        .value=${this.formData.cost?.price?.toString() ?? ''}
        @sl-input=${this.createValidateHandler('cost')}
      ></sl-input>
      ${this.renderFieldErrors('cost')}

      ${this.renderCooperationSelect()}
    `;
  }

  protected renderCooperationSelect(): TemplateResult {
    const cooperations = this.getFilteredCooperations();
    if (this.workshopCooperations === undefined || this.workshopCooperations.length === 0) {
      return html`
        <sl-alert variant="warning" open>
          <sl-icon slot="icon" name="info-circle"></sl-icon>
          Нет доступных коопераций типа "OFFER_COOPERATION" для этой мастерской.
          Для привязки предложения, сначала создайте кооперацию.
        </sl-alert>
      `;
    }

    if (cooperations.length === 0) {
      return html`
        <sl-alert variant="warning" open>
          <sl-icon slot="icon" name="exclamation-triangle"></sl-icon>
          Нет подходящих коопераций для текущего типа предложения (${this.getOfferTypeDisplayName(this.offerType)}).
        </sl-alert>
      `;
    }

    return html`
      <sl-select
        label="Привязать к кооперации"
        placeholder="Выберите кооперацию"
        clearable
        .value=${this.formData.offerCooperationId ?? ''}
        @sl-change=${this.createValidateHandler('offerCooperationId')}
      >
        ${cooperations.map(coop => html`
          <sl-option value=${coop.id}>${coop.title}</sl-option>
        `)}
      </sl-select>
      ${this.renderFieldErrors('offerCooperationId')}
    `;
  }

  // НОВОЕ: Логика фильтрации коопераций
  protected getFilteredCooperations(): CooperationNodeAttrs[] {
    if (!this.workshopCooperations) {
      return [];
    }

    const offerTypeToCooperationContext: Record<OfferTypes, CooperationContextType> = {
      'WORKSPACE_RENT_OFFER': 'RENT',
      'PRODUCT_SALE_OFFER': 'PRODUCT_SALE',
      'HOBBY_KIT_OFFER': 'HOBBY_KIT',
      'COURSE_OFFER': 'COURSE',
    };

    const expectedContextType = offerTypeToCooperationContext[this.offerType];

    if (!expectedContextType) {
      return [];
    }

    return this.workshopCooperations.filter(coop => 
        coop.contextType.includes(expectedContextType)
    );
  }

  private getOfferTypeDisplayName(type: OfferTypes): string {
    switch (type) {
      case 'WORKSPACE_RENT_OFFER': return 'Абонемент';
      case 'PRODUCT_SALE_OFFER': return 'Изделие';
      case 'HOBBY_KIT_OFFER': return 'Набор для творчества';
      case 'COURSE_OFFER': return 'Курс';
      default: return 'Неизвестный тип';
    }
  }

  protected getFieldValue(field: keyof T & string): unknown {
    if (field === 'cost') return this.formData['cost']?.price;
    return this.formData[field];
  }

  protected setFieldValue(field: keyof T & string, value: unknown): void {
    if (field === 'cost') {
      value = ({ ...this.formData.cost, price: Number(value) } as Cost)
    }
    this.formData = { ...this.formData, [field]: value };
  }

  protected getValidator(
    field: keyof T & string,
  ): LiteralFieldValidator<string, boolean, boolean, LiteralDataType> {
    // подставляем вместо dto cost, literal price, но под именем cost.
    // другой вариант, сделать сам formData плоским объектом.
    if (field === 'cost') return costVmap.price.cloneWithName('cost');
    return super.getValidator(field);
  }
}
