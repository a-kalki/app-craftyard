import { cooperationApiUrl } from "#cooperations/constants";
import type { ModuleConfig, UseCase } from "rilata/api";
import type { CraftYardResolvers } from "#app/api/resolvers";
import type { PerformCheckerService } from "#app/api/perform-checker-service";
import type { ContentDelivererService } from "#app/api/content-deliverer-service";
import { GetCooperationUseCase } from "./use-cases/get-cooperation.uc";
import { GetRootCooperationDbosUseCase } from "./use-cases/get-root-cooperations-dbos.uc";
import { GetWorkshopCooperationsUC } from "./use-cases/get-workshop-cooperations";

export const cooperationModuleConfig: ModuleConfig = {
  moduleUrls: [cooperationApiUrl]
}

export const cooperationModuleUseCases: UseCase[] = [
  new GetCooperationUseCase(),
  new GetRootCooperationDbosUseCase(),
  new GetWorkshopCooperationsUC(),
]

export const cooperationModulePermissionCheckers: PerformCheckerService<CraftYardResolvers>[] = []

export const cooperationModuleContentDeliverer: ContentDelivererService<CraftYardResolvers>[] = []
