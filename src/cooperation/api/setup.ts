import { cooperationApiUrl } from "#cooperation/constants";
import type { ModuleConfig, UseCase } from "rilata/api";
import type { CraftYardResolvers } from "#app/api/resolvers";
import type { PerformCheckerService } from "#app/api/perform-checker-service";
import type { ContentDelivererService } from "#app/api/content-deliverer-service";
import { GetCooperationUseCase } from "./use-cases/get-cooperation.uc";
import { GetRootCooperationDbosUseCase } from "./use-cases/get-root-cooperations-dbos.uc";

export const cooperationModuleConfig: ModuleConfig = {
    moduleUrls: [cooperationApiUrl]
}

export const cooperationModuleUseCases: UseCase[] = [
  new GetCooperationUseCase(),
  new GetRootCooperationDbosUseCase(),
]

export const cooperationModulePermissionCheckers: PerformCheckerService<CraftYardResolvers>[] = [
]

export const cooperationModuleContentDeliverer: ContentDelivererService<CraftYardResolvers>[] = [
]
