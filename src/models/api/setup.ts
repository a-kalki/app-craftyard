import { modelApiUrl } from "#models/constants";
import type { ModuleConfig, UseCase } from "rilata/api";
import { GetModelsUC } from "./use-cases/get-models/use-case";
import { GetModelUC } from "./use-cases/get-model/use-case";
import { AddModelImagesUC } from "./use-cases/add-images/use-case";
import { DeleteModelImageUC } from "./use-cases/delete-image/use-case";
import { ReoderModelImagesUC } from "./use-cases/reorder-images/use-case";
import type { CraftYardResolvers } from "#app/api/resolvers";
import type { PerformCheckerService } from "#app/api/perform-checker-service";
import { ThesisSetPerformCheckersService } from "./module-mediator/perform-checkers/thesis-set";
import type { ContentDelivererService } from "#app/api/content-deliverer-service";
import { ThesisSetContentDeliverer } from "./module-mediator/content-deliverers/thesis-set";

export const modelModuleConfig: ModuleConfig = {
  moduleUrls: [modelApiUrl],
}

export const modelModuleUseCases: UseCase[] = [
  new GetModelsUC(),
  new GetModelUC(),
  new AddModelImagesUC(),
  new ReoderModelImagesUC(),
  new DeleteModelImageUC(),
]

export const modelModulePermissionCheckers: PerformCheckerService<CraftYardResolvers>[] = [
  new ThesisSetPerformCheckersService(),
]

export const modelModuleContentDeliverer: ContentDelivererService<CraftYardResolvers>[] = [
  new ThesisSetContentDeliverer(),
]
