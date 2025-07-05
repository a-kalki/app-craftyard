import type { ModelCreationOfferAttrs } from "#offer/domain/base-offer/struct/attrs";

/**
 * @description Пользовательский контент для hobby offer.
 */
export type HobbyKitOfferContentType = 'hobby-kit';

/**
 * @description Предложение набора для самостоятельного изготовления (хобби).
 */
export type HobbyKitOfferAttrs = ModelCreationOfferAttrs & {
  type: 'HobbyKitOffer';
  workshopOfferId: string; // Автоматический абонемент для хобби
  materialPreparationHours: number; // Срок подготовки материалов в часах
}
