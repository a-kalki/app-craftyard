import type { UsersModuleMeta, UsersModuleResolvers } from "./types";
import { usersModuleConfig, usersModulePermissionCheckers, usersModuleUseCases } from "./setup";
import { UserAr } from "#users/domain/user/a-root";
import { CraftYardModule } from "#app/api/module";

export class UsersModule extends CraftYardModule<UsersModuleMeta> {
    name = "Users Module" as const;

    constructor(resolvers: UsersModuleResolvers) {
      super(
        usersModuleConfig,
        resolvers,
        usersModuleUseCases,
        usersModulePermissionCheckers,
      )
      this.checkArInvariants();
    }

    getFacade(): unknown {
      throw new Error("Method not implemented.");
    }

    async checkArInvariants(): Promise<void> {
      const users = await this.resolvers.moduleResolver.userRepo.getUsers();
      users.forEach(attrs => new UserAr(attrs));
    }
}
