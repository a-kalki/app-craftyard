import { modelApiUrl } from "#models/constants";
import type { ModuleConfig, UseCase } from "rilata/api";
import { GetModelsUC } from "./use-cases/get-models/use-case";
import { GetModelUC } from "./use-cases/get-model/use-case";
import { AddModelImagesUC } from "./use-cases/add-images/use-case";
import { DeleteModelImageUC } from "./use-cases/delete-image/use-case";
import { ReoderModelImagesUC } from "./use-cases/reorder-images/use-case";

export const modelModuleConfig: ModuleConfig = {
    moduleUrls: [modelApiUrl]
}

export const modelModuleUseCases: UseCase[] = [
  new GetModelsUC(),
  new GetModelUC(),
  new AddModelImagesUC(),
  new ReoderModelImagesUC(),
  new DeleteModelImageUC(),
]
