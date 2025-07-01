import type { CraftYardResolvers } from "#app/api/resolvers";
import { userContentsApiUrls } from "#user-contents/constants";
import type { ModuleConfig, UseCase } from "rilata/api";
import { AddContentSectionUC } from "./use-cases/section/add-content-section/use-case";
import { EditContentSectionUC } from "./use-cases/section/edit-content-section/use-case";
import { GetContentSectionUC } from "./use-cases/section/get-content-section/use-case";
import { DeleteContentSectionUC } from "./use-cases/section/delete-content-section/use-case";
import { GetOwnerArContentSectionsUC } from "./use-cases/section/get-owner-content-sections/use-case";
import type { PerformCheckerService } from "#app/api/perform-checker-service";
import { AddUserContentUC } from "./use-cases/section/user-content/add-content/use-case";
import { EditUserContentUC } from "./use-cases/section/user-content/edit-content/use-case";
import { DeleteUserContentUC } from "./use-cases/section/user-content/delete-content/use-case";
import { GetUserContentUC } from "./use-cases/section/user-content/get-content/use-case";
import { GetSectionContentsUC } from "./use-cases/section/user-content/get-section-contents/use-case";

export const userContentModuleConfig: ModuleConfig = {
  moduleUrls: [userContentsApiUrls],
}

export const userContentModuleUseCases: UseCase[] = [
  new AddContentSectionUC(),
  new EditContentSectionUC(),
  new GetContentSectionUC(),
  new DeleteContentSectionUC(),
  new GetOwnerArContentSectionsUC(),
  new AddUserContentUC(),
  new EditUserContentUC(),
  new DeleteUserContentUC(),
  new GetUserContentUC(),
  new GetSectionContentsUC(),
]

export const userContentModulePermissionCheckers: PerformCheckerService<CraftYardResolvers>[] = []
