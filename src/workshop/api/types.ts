import type { CraftYardServerResolver } from "#app/api/resolvers"
import type { WorkshopRepo } from "#workshop/domain/repo"

export type WorkshopsModuleResolver = {
  workshopRepo: WorkshopRepo,
}

export type WorkshopsModuleResolvers = {
  serverResolver: CraftYardServerResolver,
  moduleResolver: WorkshopsModuleResolver
}

export type WorkshopsModuleMeta = {
  name: "Workshops Module",
  resolvers: WorkshopsModuleResolvers
}
