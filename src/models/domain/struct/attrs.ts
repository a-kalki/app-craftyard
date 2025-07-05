import type { Cost, SkillLevel } from "#app/domain/types";
import type { MODEL_CATEGORY_TITLES } from "./constants"

/** User content contexts */
export type ModelContentContextTypes = 'model-info';

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
  cost: Cost,
  createAt: number,
  updateAt: number,
}
