import { offerApiUrl } from "#offer/constants";
import type { ModuleConfig, UseCase } from "rilata/api";
import type { CraftYardResolvers } from "#app/api/resolvers";
import type { PerformCheckerService } from "#app/api/perform-checker-service";
import type { ContentDelivererService } from "#app/api/content-deliverer-service";

export const offerModuleConfig: ModuleConfig = {
    moduleUrls: [offerApiUrl]
}

export const offerModuleUseCases: UseCase[] = [
]

export const offerModulePermissionCheckers: PerformCheckerService<CraftYardResolvers>[] = [
]

export const offerModuleContentDeliverer: ContentDelivererService<CraftYardResolvers>[] = [
]
