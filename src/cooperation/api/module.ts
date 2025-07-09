import { CraftYardModule } from "#app/api/module";
import { cooperationFactory } from "#cooperation/domain/factory";
import { cooperationModuleConfig, cooperationModuleUseCases } from "./setup";
import type { CooperationModuleMeta, CooperationModuleResolvers } from "./types";

export class CooperationModule extends CraftYardModule<CooperationModuleMeta> {
  name = "Cooperation Module" as const;

  constructor(resolvers: CooperationModuleResolvers) {
    super(
      cooperationModuleConfig,
      resolvers,
      cooperationModuleUseCases,
    );
    this.checkArInvariants();
  }

  async checkArInvariants(): Promise<void> {
    const cooperations = await this.resolvers.moduleResolver.cooperationRepo.getAll();
    cooperations.forEach(dbo => cooperationFactory.restore(dbo));
  }
}
