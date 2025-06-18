import type { ModuleConfig, UseCase } from "rilata/api";
import { fileApiUrls } from "../constants";
import { UploadFileUC } from "./use-cases/upload-file/use-case";
import { GetFileUC } from "./use-cases/get-file/use-case";

export const filesModuleConfig: ModuleConfig = {
  moduleUrls: [fileApiUrls],
}

export const filesModuleUseCases: UseCase[] = [
  new UploadFileUC(),
  new GetFileUC(),
]
