import type { CraftYardServerResolver } from "#app/api/resolvers"
import type { ApiModelFacade } from "#models/domain/facade"
import type { OfferRepo } from "#offer/domain/repo"
import type { ApiWorkshopsFacade } from "#workshop/domain/facade"

export type OfferModuleResolver = {
  offerRepo: OfferRepo,
  workshopFacade: ApiWorkshopsFacade
  modelFacade: ApiModelFacade
}

export type OfferModuleResolvers = {
  serverResolver: CraftYardServerResolver,
  moduleResolver: OfferModuleResolver
}

export type OfferModuleMeta = {
  name: "Offer Module",
  resolvers: OfferModuleResolvers
}
