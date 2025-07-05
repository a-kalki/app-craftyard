import type { BaseOfferAttrs } from "#offer/domain/base-offer/struct/attrs";

/**
 * @description Предложение от Коворкинг Мастерской (например, абонементы).
 */
export type WorkspaceRentOfferAttrs = BaseOfferAttrs & {
  type: 'WorkspaceRentOffer';
  accessHours: number; // Время доступа;
  mastersDiscount: number; // Скидка для мастеров, для HobbistKit;
}

