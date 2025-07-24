import type { ModelModuleMeta, ModelModuleResolvers } from "./types";
import { modelModuleConfig, modelModuleContentDeliverer, modelModulePermissionCheckers, modelModuleUseCases } from "./setup";
import { ModelAr } from "#models/domain/a-root";
import { CraftYardModule } from "#app/api/module";

export class ModelModule extends CraftYardModule<ModelModuleMeta> {
    name = "Model Module" as const;

    constructor(resolvers: ModelModuleResolvers) {
      super(
        modelModuleConfig,
        resolvers,
        modelModuleUseCases,
        modelModulePermissionCheckers,
        modelModuleContentDeliverer,
      );
      this.checkArInvariants();
    }

    async checkArInvariants(): Promise<void> {
      const models = await this.resolvers.moduleResolver.modelRepo.filter({});
      models.forEach(attrs => new ModelAr(attrs));
    }
}
