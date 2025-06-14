import type { DedokServerResolver } from "#app/api/server-resolver"
import type { UserRepo } from "#app/domain/user/repo"

export type UsersModuleResolver = {
    moduleUrls: ['/api/users'],
    db: UserRepo,
}

export type UsersModuleResolvers = {
  serverResolver: DedokServerResolver,
  moduleResolver: UsersModuleResolver
}

export type UsersModuleMeta = {
  name: "Users Module",
  resolvers: UsersModuleResolvers
}
