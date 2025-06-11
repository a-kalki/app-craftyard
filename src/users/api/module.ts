import { WebModule } from "rilata/api";
import type { UsersModuleMeta } from "./types";
import { usersModuleConfig, usersModuleResolver, usersModuleUseCases } from "./resolver";
import type { ServerResolver } from "rilata/api-server";

export class UsersModule extends WebModule<UsersModuleMeta> {
    name = "Users Module" as const;

    constructor(serverResolver: ServerResolver) {
      super(
        usersModuleConfig,
        {
          moduleResolver: usersModuleResolver,
          serverResolver: serverResolver,
        },
        usersModuleUseCases,
      )
    }
}
