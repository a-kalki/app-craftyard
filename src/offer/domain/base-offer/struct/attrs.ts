import type { Cost } from "#app/domain/types";
import type { UserId } from "rilata/core";

/**
 * @description Детализация расходной части предложения.
 */
export type  ExpenseItem = {
  title: string;
  description?: string,
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
  organizationId: string; // Ссылка на мастерскую для которого актуально предложение
  offerCooperationId: string; // Ссылка на кооперацию исполнителей
  cost: Cost; // Конечная стоимость для покупателя в тенге
  status: OfferStatus; // Статус предложения
  editorIds: UserId[];
  createAt: number,
  updateAt: number,
}

/**
 * @description Базовый абстрактный класс для предложений, связанных с конкретной Model.
 */
export type ModelCreationOfferAttrs = BaseOfferAttrs & {
  modelId: string; // Ссылка на Model
  masterId: string; // Ссылка на ответственного мастера
  estimatedExpenses: ExpenseItem[]; // Предполагаемая расходная часть предложения
}
