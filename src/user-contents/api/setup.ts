import type { CraftYardResolvers } from "#app/api/resolvers";
import { userContentsApiUrls } from "#user-contents/constants";
import type { ModuleConfig, UseCase } from "rilata/api";
import { AddContentSectionUC } from "./use-cases/section/add-section.uc.ts";
import { EditContentSectionUC } from "./use-cases/section/edit-section.uc.ts";
import { GetContentSectionUC } from "./use-cases/section/get-section.uc.ts";
import { DeleteContentSectionUC } from "./use-cases/section/delete-section.uc.ts";
import { GetOwnerArContentSectionsUC } from "./use-cases/section/get-owner-sections.uc.ts";
import type { PerformCheckerService } from "#app/api/perform-checker-service";
import { AddUserContentUC } from "./use-cases/content/add-content.uc.ts";
import { EditUserContentUC } from "./use-cases/content/edit-content.uc.ts";
import { DeleteUserContentUC } from "./use-cases/content/delete-content.uc.ts";
import { GetUserContentUC } from "./use-cases/content/get-content.uc.ts";
import { GetSectionContentsUC } from "./use-cases/content/get-section-contents.uc.ts";

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
