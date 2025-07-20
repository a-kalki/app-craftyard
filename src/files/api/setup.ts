import type { ModuleConfig, UseCase } from "rilata/api";
import { fileApiUrls } from "../constants";
import { UploadFileUC } from "./use-cases/upload-file.uc.ts";
import { GetFileUC } from "./use-cases/get-file.uc.ts";
import type { CraftYardResolvers } from "#app/api/resolvers";
import type { PerformCheckerService } from "#app/api/perform-checker-service";
import { GetFilesUC } from "./use-cases/get-files.uc.ts";

export const filesModuleConfig: ModuleConfig = {
  moduleUrls: [fileApiUrls],
}

export const filesModuleUseCases: UseCase[] = [
  new UploadFileUC(),
  new GetFileUC(),
  new GetFilesUC(),
]

export const filesModulePermissionCheckers: PerformCheckerService<CraftYardResolvers>[] = [

]
