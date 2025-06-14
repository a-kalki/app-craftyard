import type { UseCase } from "rilata/api";
import { GetUsersUC } from "./use-cases/get-users/use-case";
import { GetUserUC } from "./use-cases/get-user/use-case";
import { EditUserUseCase } from "./use-cases/edit-user/use-case";
import { AuthUserUseCase } from "./use-cases/auth-user/use-case";

export const usersModuleConfig = {}

export const usersModuleUseCases: UseCase[] = [
  new AuthUserUseCase(),
  new GetUsersUC(),
  new GetUserUC(),
  new EditUserUseCase(),
]
