import { CraftYardModule } from "#app/api/module";

export class OfferModule extends CraftYardModule<OfferModuleMeta> {
    name = "Offer Module" as const;

    constructor(resolvers: OfferModuleResolvers) {
      super(
        offerModuleConfig,
        resolvers,
        offerModuleUseCases,
        offerModulePermissionCheckers,
        offerModuleContentDeliverer,
      );
      this.checkArInvariants();
    }

    async checkArInvariants(): Promise<void> {
      const offers = await this.resolvers.moduleResolver.offerRepo.getOffers();
      offers.forEach(attrs => new OfferAr(attrs));
    }
}
