import type { GetModelsCommand } from "#models/domain/struct/get-models/contract";
import { DtoFieldValidator, type ValidatorMap } from "rilata/validator";
import { modelAttrsVmap } from "../v-map";

const getModelsVmap: ValidatorMap<GetModelsCommand['attrs']> = {
  id: modelAttrsVmap.id.cloneWithRequired(false),
  title: modelAttrsVmap.title.cloneWithRequired(false),
  description: modelAttrsVmap.description.cloneWithRequired(false),
  ownerId: modelAttrsVmap.ownerId.cloneWithRequired(false),
  imageIds: modelAttrsVmap.imageIds.cloneWithRequired(false),
  categories: modelAttrsVmap.categories.cloneWithRequired(false),
  difficultyLevel: modelAttrsVmap.difficultyLevel.cloneWithRequired(false),
  estimatedTime: modelAttrsVmap.estimatedTime.cloneWithRequired(false),
  cost: modelAttrsVmap.cost.cloneWithRequired(false),
  createAt: modelAttrsVmap.createAt.cloneWithRequired(false),
  updateAt: modelAttrsVmap.updateAt.cloneWithRequired(false)
}

export const getModelsValidator = new DtoFieldValidator(
  'get-models', true, { isArray: false }, 'dto', getModelsVmap,
);
