import type { ModelCategory } from "./attrs"

export const MODEL_CATEGORY_TITLES = {
  KITCHEN: 'Кухня',
  GARDEN: 'Сад',
  INTERIOR: 'Интерьер',
  DECOR: 'Декор',
  FURNITURE: 'Мебель',
}

export const MODEL_CATEGORY_KEYS = Object.keys(MODEL_CATEGORY_TITLES) as ModelCategory[]
