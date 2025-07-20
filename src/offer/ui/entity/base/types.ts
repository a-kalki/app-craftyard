import type { ModelAttrs } from '#models/domain/struct/attrs';
import type { OfferTypes } from '#offer/domain/types';

/**
 * Интерфейс для модального диалога добавления предложения.
 */
export interface AddModelOfferModalDialog extends HTMLElement {

  /**
   * Показывает модальное окно для добавления предложения.
   */
  show(offerType: OfferTypes, modelAttrs: ModelAttrs): Promise<{ offerId: string } | null>;
}
