import type { CraftYardServerResolver } from "#app/api/resolvers"
import type { UserRepo } from "#app/domain/user/repo"
import type { ApiUserContentsSectionFacade } from "#user-contents/domain/section/facade"

export type UsersModuleResolver = {
  userRepo: UserRepo,
  userContentFacade: ApiUserContentsSectionFacade
}

export type UsersModuleResolvers = {
  serverResolver: CraftYardServerResolver,
  moduleResolver: UsersModuleResolver
}

export type UsersModuleMeta = {
  name: "Users Module",
  resolvers: UsersModuleResolvers
}
