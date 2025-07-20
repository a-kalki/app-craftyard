import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ValidatableElement } from '#app/ui/base/validatable-element';
import type { Cost } from '#app/domain/types';
import { costVmap } from '#app/domain/v-map';

@customElement('cost-input')
export class CostInput extends ValidatableElement<Cost> {
  static styles = css`
    .cost-input-container {
      display: flex;
      flex-direction: column;
    }
    .error {
      color: var(--sl-color-danger-600);
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
  `;

  @property({ type: Object })
  cost: Cost = { price: 0, currency: 'KZT' };

  @property({ type: Object })
  validatorMap = costVmap

  protected formData: Cost;

  constructor() {
    super();
    this.formData = { ...this.cost };
  }

  protected getFieldValue(field: keyof Cost): unknown {
    return this.formData[field];
  }

  protected setFieldValue(field: keyof Cost, value: unknown): void {
    this.formData = { ...this.formData, [field]: value as number };
  }

  validateAndUpdateField(field: keyof Cost) {
    super.validateAndUpdateField(field);
    this.dispatchEvent(new CustomEvent(
      'sl-change',
      { detail: {
        value: this.formData,
        errors: this.fieldErrors,
      }}
    ));
  }

  render() {
    return html`
      <div class="cost-input-container">
        <sl-input
          label="Цена"
          type="number"
          .value=${this.cost.price?.toString() ?? ''}
          @sl-input=${this.createValidateHandler}
        ></sl-input>
        ${this.renderFieldErrors('price')}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cost-input': CostInput;
  }
}
