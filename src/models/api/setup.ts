import { modelApiUrl } from "#models/constants";
import type { ModuleConfig, UseCase } from "rilata/api";
import type { CraftYardResolvers } from "#app/api/resolvers";
import type { PerformCheckerService } from "#app/api/perform-checker-service";
import type { ContentDelivererService } from "#app/api/content-deliverer-service";
import { FilesPerformCheckersService } from "./module-mediator/perform-checkers/files";
import { ContentSectionPerformCheckersService } from "./module-mediator/perform-checkers/content-sections";
import { GetModelsUC } from "./use-cases/get-models.uc.ts";
import { GetModelUC } from "./use-cases/get-model.uc.ts";
import { AddModelImagesUC } from "./use-cases/add-images.uc.ts";
import { DeleteModelImageUC } from "./use-cases/delete-image.uc.ts";
import { ReoderModelImagesUC } from "./use-cases/reorder-images.uc.ts";
import { EditModelUC } from "./use-cases/edit-model.uc.ts";
import { AddModelUC } from "./use-cases/add-model.uc.ts";

export const modelModuleConfig: ModuleConfig = {
    moduleUrls: [modelApiUrl]
}

export const modelModuleUseCases: UseCase[] = [
  new GetModelsUC(),
  new GetModelUC(),
  new AddModelImagesUC(),
  new ReoderModelImagesUC(),
  new DeleteModelImageUC(),
  new EditModelUC(),
  new AddModelUC(),
]

export const modelModulePermissionCheckers: PerformCheckerService<CraftYardResolvers>[] = [
  new ContentSectionPerformCheckersService(),
  new FilesPerformCheckersService(),
]

export const modelModuleContentDeliverer: ContentDelivererService<CraftYardResolvers>[] = [
]
