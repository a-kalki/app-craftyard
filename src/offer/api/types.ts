import type { CraftYardServerResolver } from "#app/api/resolvers"
import type { OfferRepo } from "#offer/domain/base-offer/repo"

export type OfferModuleResolver = {
  offerRepo: OfferRepo,
}

export type OfferModuleResolvers = {
  serverResolver: CraftYardServerResolver,
  moduleResolver: OfferModuleResolver
}

export type OfferModuleMeta = {
  name: "Offer Module",
  resolvers: OfferModuleResolvers
}
