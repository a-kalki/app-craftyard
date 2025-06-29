import type { ModuleConfig, UseCase } from "rilata/api";
import { GetWorkshopUC } from "./use-cases/get-workshop/use-case";
import { workshopsApiUrl } from "#workshop/constants";
import type { CraftYardResolvers } from "#app/api/resolvers";
import type { PerformCheckerService } from "#app/api/perform-checker-service";

export const workshopsModuleConfig: ModuleConfig = {
    moduleUrls: [workshopsApiUrl]
}

export const workshopsModuleUseCases: UseCase[] = [
  new GetWorkshopUC(),
]

export const workshopModulePermissionCheckers: PerformCheckerService<CraftYardResolvers>[] = [

]
