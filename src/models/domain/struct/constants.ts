import type { ModelCategory } from "./attrs"

export const modelCategoriesTitles = {
  KITCHEN: 'Кухня',
  GARDEN: 'Сад',
  INTERIOR: 'Интерьер',
  DECOR: 'Декор',
  FURNITURE: 'Мебель',
}

export const modelCategoryKeys = Object.keys(modelCategoriesTitles) as ModelCategory[]
