import type { ModuleConfig, UseCase } from "rilata/api";
import { GetWorkshopUC } from "./use-cases/get-workshop/use-case";
import { workshopsApiUrl } from "#workshop/constants";

export const workshopsModuleConfig: ModuleConfig = {
    moduleUrls: [workshopsApiUrl]
}

export const workshopsModuleUseCases: UseCase[] = [
  new GetWorkshopUC(),
]
