import { CraftYardModule } from "#app/api/module";
import { offerFactory } from "#offer/domain/factory";
import { offerModuleConfig, offerModuleUseCases } from "./setup";
import type { OfferModuleMeta, OfferModuleResolvers } from "./types";

export class OfferModule extends CraftYardModule<OfferModuleMeta> {
    name = "Offer Module" as const;

    constructor(resolvers: OfferModuleResolvers) {
      super(
        offerModuleConfig,
        resolvers,
        offerModuleUseCases,
      );
      this.checkArInvariants();
    }

    async checkArInvariants(): Promise<void> {
      const offers = await this.resolvers.moduleResolver.offerRepo.getOffers();
      offers.forEach(attrs => offerFactory.restore(attrs));
    }
}
