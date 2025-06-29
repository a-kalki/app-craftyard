import type { Executable } from "node_modules/rilata/src/api/module/types";
import { WebModule, type ModuleConfig } from "rilata/api";
import type { CraftYardResolvers, CraftYartModuleMeta } from "./resolvers";
import type { PerformCheckerService } from "./perform-checker-service";
import type { ContentDelivererService } from "./content-deliverer-service";

export abstract class CraftYardModule<
  M extends CraftYartModuleMeta
> extends WebModule<M> {
  constructor(
    protected config: ModuleConfig,
    protected resolvers: M['resolvers'],
    protected executable: Executable[],
    permissionCheckers?: PerformCheckerService<CraftYardResolvers>[],
    contentDeliverers?: ContentDelivererService<CraftYardResolvers>[],
  ) {
    super(config, resolvers, executable);
    const moduleMediator = this.resolvers.serverResolver.moduleMediator;
    permissionCheckers?.forEach((checker) => {
      checker.init(resolvers);
      moduleMediator.registerPerformHandler(
        checker.abstractArName,
        checker.ownerArName,
        (payload, caller) => checker.hasPerform(payload, caller)
      )
    });
    contentDeliverers?.forEach((deliverer) => {
      deliverer.init(resolvers);
      moduleMediator.registerContentHandler(
        deliverer.abstractArName,
        deliverer.ownerArName,
        (payload, caller) => deliverer.getContent(payload, caller)
      )
    })
  }
}
