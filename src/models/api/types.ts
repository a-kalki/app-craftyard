import type { CraftYardServerResolver } from "#app/api/resolvers"
import type { FileModuleFacade } from "#files/domain/facade"
import type { ModelRepo } from "#models/domain/repo"

export type ModelModuleResolver = {
  modelRepo: ModelRepo,
  fileFacade: FileModuleFacade
}

export type ModelModuleResolvers = {
  serverResolver: CraftYardServerResolver,
  moduleResolver: ModelModuleResolver
}

export type ModelModuleMeta = {
  name: "Model Module",
  resolvers: ModelModuleResolvers
}
