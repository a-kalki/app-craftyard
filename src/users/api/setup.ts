import type { ModuleConfig, UseCase } from "rilata/api";
import { GetUsersUC } from "./use-cases/get-users/use-case";
import { GetUserUC } from "./use-cases/get-user/use-case";
import { EditUserUseCase } from "./use-cases/edit-user/use-case";
import { AuthUserUseCase } from "./use-cases/auth-user/use-case";
import { usersApiUrl } from "#users/constants";

export const usersModuleConfig: ModuleConfig = {
  moduleUrls: [usersApiUrl],
}

export const usersModuleUseCases: UseCase[] = [
  new AuthUserUseCase(),
  new GetUsersUC(),
  new GetUserUC(),
  new EditUserUseCase(),
]
