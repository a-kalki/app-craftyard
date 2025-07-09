import { cooperationApiUrl } from "#cooperation/constants";
import type { ModuleConfig, UseCase } from "rilata/api";
import type { CraftYardResolvers } from "#app/api/resolvers";
import type { PerformCheckerService } from "#app/api/perform-checker-service";
import type { ContentDelivererService } from "#app/api/content-deliverer-service";

export const cooperationModuleConfig: ModuleConfig = {
    moduleUrls: [cooperationApiUrl]
}

export const cooperationModuleUseCases: UseCase[] = [
]

export const cooperationModulePermissionCheckers: PerformCheckerService<CraftYardResolvers>[] = [
]

export const cooperationModuleContentDeliverer: ContentDelivererService<CraftYardResolvers>[] = [
]
