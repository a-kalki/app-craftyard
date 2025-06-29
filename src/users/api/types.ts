import type { CraftYardServerResolver } from "#app/api/resolvers"
import type { UserRepo } from "#app/domain/user/repo"

export type UsersModuleResolver = {
  userRepo: UserRepo,
}

export type UsersModuleResolvers = {
  serverResolver: CraftYardServerResolver,
  moduleResolver: UsersModuleResolver
}

export type UsersModuleMeta = {
  name: "Users Module",
  resolvers: UsersModuleResolvers
}
