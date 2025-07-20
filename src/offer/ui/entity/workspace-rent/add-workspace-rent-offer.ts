import { customElement } from 'lit/decorators.js';
import { html, type TemplateResult } from 'lit';
import { BaseAddOfferModal } from '../base/base-add-offer-modal';
import type { AddWorkspaceRentOfferAttrs } from '#offer/domain/crud/add-offer/contract';
import { addWorkspaceRentOfferVmap } from '#offer/domain/crud/add-offer/v-map';
import type { WorkshopAttrs } from '#workshop/domain/struct/attrs';

@customElement('add-workspace-rent-offer-modal')
export class AddWorkspaceRentOfferModal extends BaseAddOfferModal<AddWorkspaceRentOfferAttrs> {
  protected validatorMap = addWorkspaceRentOfferVmap;

  protected createDefaultOfferAttrs(): Partial<AddWorkspaceRentOfferAttrs> {
    return {
      title: undefined,
      description: undefined,
      offerCooperationId: undefined,
      organizationId: this.workshop!.id,
      type: 'WORKSPACE_RENT_OFFER',

      accessHours: undefined,
      mastersDiscount: undefined,
      cost: {
        price: 0,
        currency: 'KZT',
      }
    };
  }

  show(offerType: 'WORKSPACE_RENT_OFFER', workshop: WorkshopAttrs): Promise<{ offerId: string } | null> {
    return super.show(offerType, workshop);
  }

  protected renderSpecificFields(): TemplateResult {
    return html`
      <sl-input
        label="Длительность (в часах)"
        type="number"
        .value=${this.formData.accessHours?.toString() ?? ''}
        @sl-input=${this.createValidateHandler('accessHours')}
      ></sl-input>
      ${this.renderFieldErrors('accessHours')}

      <sl-input
        label="Скидка для мастера (%)"
        type="number"
        .value=${this.formData.mastersDiscount?.toString() ?? ''}
        @sl-input=${this.createValidateHandler('mastersDiscount')}
      ></sl-input>
      ${this.renderFieldErrors('mastersDiscount')}
    `;
  }

  protected setFieldValue(field: keyof AddWorkspaceRentOfferAttrs, value: unknown): void {
    if (field === 'accessHours' || field === 'mastersDiscount') {
      this.formData = { ...this.formData, [field]: Number(value) };
      return;
    }
    super.setFieldValue(field, value);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'add-workspace-rent-offer-modal': AddWorkspaceRentOfferModal;
  }
}
