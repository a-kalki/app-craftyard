import type { CraftYardServerResolver } from "#app/api/resolvers"
import type { ApiFileFacade } from "#app/domain/file/facade"
import type { ModelRepo } from "#models/domain/repo"

export type ModelModuleResolver = {
  modelRepo: ModelRepo,
  fileFacade: ApiFileFacade,
}

export type ModelModuleResolvers = {
  serverResolver: CraftYardServerResolver,
  moduleResolver: ModelModuleResolver
}

export type ModelModuleMeta = {
  name: "Model Module",
  resolvers: ModelModuleResolvers
}
