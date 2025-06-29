import type { CraftYardServerResolver } from "#app/api/resolvers"
import type { ThesisSetRepo } from "#user-contents/domain/thesis-set/repo"

export type UserContentModuleResolver = {
  thesisSetRepo: ThesisSetRepo,
}

export type UserContentModuleResolvers = {
  serverResolver: CraftYardServerResolver,
  moduleResolver: UserContentModuleResolver
}

export type UserContentModuleMeta = {
  name: "User Content Module",
  resolvers: UserContentModuleResolvers
}
