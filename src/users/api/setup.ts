import type { ModuleConfig, UseCase } from "rilata/api";
import { GetUsersUC } from "./use-cases/get-users.uc.ts";
import { GetUserUC } from "./use-cases/get-user.uc.ts";
import { EditUserUseCase } from "./use-cases/edit-user.uc.ts";
import { AuthUserUseCase } from "./use-cases/auth-user.uc.ts";
import { usersApiUrl } from "#users/constants";
import type { CraftYardResolvers } from "#app/api/resolvers";
import type { PerformCheckerService } from "#app/api/perform-checker-service";

export const usersModuleConfig: ModuleConfig = {
  moduleUrls: [usersApiUrl],
}

export const usersModuleUseCases: UseCase[] = [
  new AuthUserUseCase(),
  new GetUsersUC(),
  new GetUserUC(),
  new EditUserUseCase(),
]

export const usersModulePermissionCheckers: PerformCheckerService<CraftYardResolvers>[] = [

]
