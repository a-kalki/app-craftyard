import type { ModuleConfig, UseCase } from "rilata/api";
import { fileApiUrls } from "../constants";
import { UploadFileUC } from "./use-cases/upload-file/use-case";
import { GetFileUC } from "./use-cases/get-file/use-case";
import type { CraftYardResolvers } from "#app/api/resolvers";
import type { PerformCheckerService } from "#app/api/perform-checker-service";

export const filesModuleConfig: ModuleConfig = {
  moduleUrls: [fileApiUrls],
}

export const filesModuleUseCases: UseCase[] = [
  new UploadFileUC(),
  new GetFileUC(),
]

export const filesModulePermissionCheckers: PerformCheckerService<CraftYardResolvers>[] = [

]
