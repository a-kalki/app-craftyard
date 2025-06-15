import { WebModule } from "rilata/api";
import type { UsersModuleMeta, UsersModuleResolvers } from "./types";
import { usersModuleConfig, usersModuleUseCases } from "./setup";
import { UserAr } from "#app/domain/user/a-root";

export class UsersModule extends WebModule<UsersModuleMeta> {
    name = "Users Module" as const;

    constructor(resolvers: UsersModuleResolvers) {
      super(
        usersModuleConfig,
        resolvers,
        usersModuleUseCases,
      )
    }

    async checkArInvariants(): Promise<void> {
      const users = await this.resolvers.moduleResolver.db.getUsers();
      users.forEach(attrs => new UserAr(attrs));
    }
}
