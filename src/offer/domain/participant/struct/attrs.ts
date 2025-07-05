export type OfferParticipantType = 'user' | 'workshop';

/**
 * @description Абстрактный объект, описывающий сторону, которая получает долю от прибыли.
 * Может быть как индивидуальным лицом, так и композитной структурой (например, команда, мастерская).
 */
export type OfferParticipantAttrs = {
  id: string;
  type: OfferParticipantType;
  role?: string;
  fatherId?: string; // ссылка на родителя
  ownerId?: string; // конечный получатель денег
  responsibilities: string[];
  profitSharePercentage: number;
  childrensIds?: string[]; // ссылки на родителей
}
