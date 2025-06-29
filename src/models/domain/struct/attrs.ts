import type { Cost, SkillLevel } from "#app/domain/types";
import type { MODEL_CATEGORY_TITLES } from "./constants"

export type ModelCategory = keyof typeof MODEL_CATEGORY_TITLES;

export type ModelAttrs = {
  id: string,
  title: string,
  description: string,
  ownerId: string,
  imageIds: string[],
  categories: ModelCategory[],
  difficultyLevel: SkillLevel,
  estimatedTime: string,
  costPerAccess: Cost,
}
