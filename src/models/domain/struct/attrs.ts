import type { SkillLevel } from "#app/domain/types";
import type { modelCategoriesTitles } from "./constants"

export type ModelCategory = keyof typeof modelCategoriesTitles;

export type ModelAttrs = {
  id: string,
  title: string,
  description: string,
  owner: string,
  imageIds: string[],
  categories: ModelCategory[],
  difficultyLevel: SkillLevel,
  materialsList: string[],
  toolsRequired: string[],
  estimatedTime: string,
  pricePerAccess: number,
}
