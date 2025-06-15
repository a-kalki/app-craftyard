import { WebModule } from "rilata/api";
import type { WorkshopsModuleMeta, WorkshopsModuleResolvers } from "./types";
import { workshopsModuleConfig, workshopsModuleUseCases } from "./setup";
import { WorkshopAr } from "#workshop/domain/a-root";

export class WorkshopsModule extends WebModule<WorkshopsModuleMeta> {
    name = "Workshops Module" as const;

    constructor(resolvers: WorkshopsModuleResolvers) {
      super(
        workshopsModuleConfig,
        resolvers,
        workshopsModuleUseCases,
      );
      this.checkArInvariants();
    }

    async checkArInvariants(): Promise<void> {
      const workshops = await this.resolvers.moduleResolver.db.getWorkshops();
      workshops.forEach(wsAttrs => new WorkshopAr(wsAttrs));
    }
}
