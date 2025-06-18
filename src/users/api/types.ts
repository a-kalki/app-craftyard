import type { CreaftYardServerResolver } from "#app/api/server-resolver"
import type { UserRepo } from "#app/domain/user/repo"

export type UsersModuleResolver = {
  db: UserRepo,
}

export type UsersModuleResolvers = {
  serverResolver: CreaftYardServerResolver,
  moduleResolver: UsersModuleResolver
}

export type UsersModuleMeta = {
  name: "Users Module",
  resolvers: UsersModuleResolvers
}
