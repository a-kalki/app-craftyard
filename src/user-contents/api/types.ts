import type { CraftYardServerResolver } from "#app/api/resolvers"
import type { UserContentRepo } from "#user-contents/domain/content/repo"
import type { ContentSectionRepo } from "#user-contents/domain/section/repo"

export type UserContentModuleResolver = {
  contentSectionRepo: ContentSectionRepo,
  userContentRepo: UserContentRepo
}

export type UserContentModuleResolvers = {
  serverResolver: CraftYardServerResolver,
  moduleResolver: UserContentModuleResolver
}

export type UserContentModuleMeta = {
  name: "User Content Module",
  resolvers: UserContentModuleResolvers
}
