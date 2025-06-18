import type { CreaftYardServerResolver } from "#app/api/server-resolver"
import type { ModelRepo } from "#models/domain/repo"

export type ModelModuleResolver = {
    db: ModelRepo,
}

export type ModelModuleResolvers = {
  serverResolver: CreaftYardServerResolver,
  moduleResolver: ModelModuleResolver
}

export type ModelModuleMeta = {
  name: "Model Module",
  resolvers: ModelModuleResolvers
}
