import type { OfferTypes } from '#offer/domain/types';
import type { AddModelOfferModalDialog } from './entity/base/types';

export class OfferModalManager {
  /**
   * Возвращает экземпляр модального окна для добавления предложения указанного типа.
   */
  public getAddOfferModal(type: Exclude<OfferTypes, 'WORKSPACE_RENT_OFFER'>): AddModelOfferModalDialog {
    switch (type) {
      case 'PRODUCT_SALE_OFFER':
         return document.createElement('add-product-sale-offer-modal') as AddModelOfferModalDialog;
      case 'HOBBY_KIT_OFFER':
         return document.createElement('add-hobby-kit-offer-modal') as AddModelOfferModalDialog;
      case 'COURSE_OFFER':
         return document.createElement('add-course-offer-modal') as AddModelOfferModalDialog;
      default:
        throw new Error(`Неизвестный тип Оффера: ${type}`);
    }
  }
}
