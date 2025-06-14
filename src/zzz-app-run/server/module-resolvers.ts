import type { UsersModuleResolvers } from "#users/api/types";
import { userRepo } from "#users/infra/users-repo";
import { dedokServerResolver } from "./resolver";

export const userModuleResolvers: UsersModuleResolvers = {
    serverResolver: dedokServerResolver,
    moduleResolver: {
        moduleUrls: ['/api/users'],
        db: userRepo
    }
}
