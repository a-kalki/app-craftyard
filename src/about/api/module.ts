import { CraftYardModule } from "#app/api/module";
import {
  appAboutModuleConfig, appAboutModuleContentDeliverer, appAboutModulePermissionCheckers,
  appAboutModuleUseCases,
} from "./setup";
import type { AppAboutModuleMeta, AppAboutModuleResolvers } from "./types";

export class AppAboutModule extends CraftYardModule<AppAboutModuleMeta> {
    name = "App About Module" as const;

    constructor(resolvers: AppAboutModuleResolvers) {
      super(
        appAboutModuleConfig,
        resolvers,
        appAboutModuleUseCases,
        appAboutModulePermissionCheckers,
        appAboutModuleContentDeliverer,
      );
    }
}
