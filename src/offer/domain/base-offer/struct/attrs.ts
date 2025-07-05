import type { Cost } from "#app/domain/types";
import type { UserId } from "rilata/core";

/**
 * @description Детализация расходной части предложения.
 */
export type  ExpenseItem = {
  name: string;
  amount: number;
}

export type OfferStatus = 'active' | 'archived' | 'pending_moderation';

/**
 * @description Абстрактный объект верхнего уровня для любого предложения (товара или услуги).
 */
export type BaseOfferAttrs = {
  id: string;
  title: string;
  description: string;
  workshopId: string; // Ссылка на мастерскую для которого актуально предложение
  cost: Cost; // Конечная стоимость для покупателя в тенге
  status: OfferStatus; // Статус предложения
  estimatedExpenses: ExpenseItem[]; // Предполагаемая расходная часть предложения
  offerParticipantId: string; // исполнители и выгодополучатели предложения
  editorIds: UserId;
}

/**
 * @description Базовый абстрактный класс для предложений, связанных с конкретной Model.
 */
export type ModelCreationOfferAttrs = BaseOfferAttrs & {
  modelId: string; // Ссылка на Model
  ownerId: string; // Ссылка на ответственного мастера
}
