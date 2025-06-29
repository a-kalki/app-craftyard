import type { WorkshopsModuleMeta, WorkshopsModuleResolvers } from "./types";
import { workshopModulePermissionCheckers, workshopsModuleConfig, workshopsModuleUseCases } from "./setup";
import { WorkshopAr } from "#workshop/domain/a-root";
import { CraftYardModule } from "#app/api/module";

export class WorkshopsModule extends CraftYardModule<WorkshopsModuleMeta> {
    name = "Workshops Module" as const;

    constructor(resolvers: WorkshopsModuleResolvers) {
      super(
        workshopsModuleConfig,
        resolvers,
        workshopsModuleUseCases,
        workshopModulePermissionCheckers,
      );
      this.checkArInvariants();
    }

    async checkArInvariants(): Promise<void> {
      const workshops = await this.resolvers.moduleResolver.workshopRepo.getWorkshops();
      workshops.forEach(wsAttrs => new WorkshopAr(wsAttrs));
    }
}
