import type { CreaftYardServerResolver } from "#app/api/server-resolver"
import type { WorkshopRepo } from "#workshop/domain/repo"

export type WorkshopsModuleResolver = {
    db: WorkshopRepo,
}

export type WorkshopsModuleResolvers = {
  serverResolver: CreaftYardServerResolver,
  moduleResolver: WorkshopsModuleResolver
}

export type WorkshopsModuleMeta = {
  name: "Workshops Module",
  resolvers: WorkshopsModuleResolvers
}
