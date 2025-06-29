import type { CraftYardResolvers } from "#app/api/resolvers";
import { userConentsApiUrls } from "#user-contents/constants";
import type { ModuleConfig, UseCase } from "rilata/api";
import { AddThesisSetUC } from "./use-cases/thesis-set/add-thesis-set/use-case";
import { EditThesisSetUC } from "./use-cases/thesis-set/edit-thesis-set/use-case";
import { GetThesisSetUC } from "./use-cases/thesis-set/get-thesis-set/use-case";
import { DeleteThesisSetUC } from "./use-cases/thesis-set/delete-thesis-set/use-case";
import { GetOwnerArThesisSetsUC } from "./use-cases/thesis-set/get-owner-ar-thesis-sets/use-case";
import type { PerformCheckerService } from "#app/api/perform-checker-service";
import { GetThesisSetContentUseCase } from "./use-cases/thesis-set/get-content-uc";
import { AddThesisUC } from "./use-cases/thesis-set/add-thesis/use-case";
import { EditThesisUC } from "./use-cases/thesis-set/edit-thesis/use-case";
import { DeleteThesisUC } from "./use-cases/thesis-set/delete-thesis/use-case";

export const userContentModuleConfig: ModuleConfig = {
  moduleUrls: [userConentsApiUrls],
}

export const userContentModuleUseCases: UseCase[] = [
  new AddThesisSetUC(),
  new EditThesisSetUC(),
  new GetThesisSetUC(),
  new DeleteThesisSetUC(),
  new GetOwnerArThesisSetsUC(),
  new GetThesisSetContentUseCase(),
  new AddThesisUC(),
  new EditThesisUC(),
  new DeleteThesisUC(),
]

export const userContentModulePermissionCheckers: PerformCheckerService<CraftYardResolvers>[] = []
