import { WebModule } from "rilata/api";
import type { ModelModuleMeta, ModelModuleResolvers } from "./types";
import { modelModuleConfig, modelModuleUseCases } from "./setup";
import { ModelAr } from "#models/domain/a-root";

export class ModelModule extends WebModule<ModelModuleMeta> {
    name = "Model Module" as const;

    constructor(resolvers: ModelModuleResolvers) {
      super(
        modelModuleConfig,
        resolvers,
        modelModuleUseCases,
      );
      this.checkArInvariants();
    }

    async checkArInvariants(): Promise<void> {
      const models = await this.resolvers.moduleResolver.db.getModels();
      models.forEach(attrs => new ModelAr(attrs));
    }
}
