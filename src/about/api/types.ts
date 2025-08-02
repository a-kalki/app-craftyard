import type { CraftYardServerResolver } from "#app/api/resolvers"

export type AppAboutModuleResolver = {}

export type AppAboutModuleResolvers = {
  serverResolver: CraftYardServerResolver,
  moduleResolver: AppAboutModuleResolver
}

export type AppAboutModuleMeta = {
  name: "App About Module",
  resolvers: AppAboutModuleResolvers
}
