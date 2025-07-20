import type { ModelOfferAttrs } from "#offer/domain/base-offer/struct/attrs";

/**
 * @description Предложение набора для самостоятельного изготовления (хобби).
 */
export type HobbyKitOfferAttrs = ModelOfferAttrs & {
  type: 'HOBBY_KIT_OFFER';
  workspaceRentOfferId: string; // Автоматический абонемент для хобби
  materialPreparationHours: number; // Срок подготовки материалов в часах
}
