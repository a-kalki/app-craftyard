import type { ModuleConfig, UseCase } from "rilata/api";
import type { CraftYardResolvers } from "#app/api/resolvers";
import type { PerformCheckerService } from "#app/api/perform-checker-service";
import type { ContentDelivererService } from "#app/api/content-deliverer-service";
import { appAboutUrl } from "#about/constants";
import { GetAppAboutContentUseCase } from "./use-cases/get-content.uc";

export const appAboutModuleConfig: ModuleConfig = {
  moduleUrls: [appAboutUrl]
}

export const appAboutModuleUseCases: UseCase[] = [
  new GetAppAboutContentUseCase(),
]

export const appAboutModulePermissionCheckers: PerformCheckerService<CraftYardResolvers>[] = [
]

export const appAboutModuleContentDeliverer: ContentDelivererService<CraftYardResolvers>[] = [
]
