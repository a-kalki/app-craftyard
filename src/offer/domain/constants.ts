import type { UnionToTuple } from 'rilata/core';
import type { OfferTypes } from './types';

export const offersData: Record<OfferTypes, {
  icon: string,
  title: string,
}> = {
  HOBBY_KIT_OFFER: {
      icon: 'bag-check',
      title: 'Набор DIY'
  },
  WORKSPACE_RENT_OFFER: {
      icon: 'bag-heart',
      title: 'Абонемент'
  },
  PRODUCT_SALE_OFFER: {
      icon: 'cart-check',
      title: 'Купить Изделие'
  },
  COURSE_OFFER: {
      icon: 'clipboard-check',
      title: 'Курсы'
  }
}

export const offerTypes: UnionToTuple<OfferTypes> = [
  'WORKSPACE_RENT_OFFER', 'PRODUCT_SALE_OFFER', 'HOBBY_KIT_OFFER', 'COURSE_OFFER'
]
