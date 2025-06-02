import type { categories, level } from "./categories"

export type Category = keyof typeof categories;

export type Level = keyof typeof level;

export type Model = {
  id: string,
  title: string,
  description: string,
  owner: string,
  images: string[],
  categories: Category[],
  materialsList: string[],
  toolsRequired: string[],
  estimatedTime: string,
  difficultyLevel: Level,
  pricePerAccess: number,
}
