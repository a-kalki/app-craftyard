import { WebModule } from "rilata/api";
import type { UsersModuleMeta, UsersModuleResolvers } from "./types";
import { usersModuleConfig, usersModuleUseCases } from "./resolver";

export class UsersModule extends WebModule<UsersModuleMeta> {
    name = "Users Module" as const;

    constructor(resolvers: UsersModuleResolvers) {
      super(
        usersModuleConfig,
        resolvers,
        usersModuleUseCases,
      )
    }
}
