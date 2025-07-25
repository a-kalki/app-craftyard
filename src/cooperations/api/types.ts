import type { CraftYardServerResolver } from "#app/api/resolvers"
import type { CooperationRepo } from "#cooperations/domain/repo"

export type CooperationModuleResolver = {
  cooperationRepo: CooperationRepo,
}

export type CooperationModuleResolvers = {
  serverResolver: CraftYardServerResolver,
  moduleResolver: CooperationModuleResolver
}

export type CooperationModuleMeta = {
  name: "Cooperation Module",
  resolvers: CooperationModuleResolvers
}
