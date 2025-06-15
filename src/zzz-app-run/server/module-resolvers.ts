import type { UsersModuleResolvers } from "#users/api/types";
import { usersRepo } from "#users/infra/repo";
import type { WorkshopsModuleResolvers } from "#workshop/api/types";
import { workshopsRepo } from "#workshop/infra/repo";
import { craftYardServerResolver } from "./resolver";

export const userModuleResolvers: UsersModuleResolvers = {
    serverResolver: craftYardServerResolver,
    moduleResolver: {
        db: usersRepo
    }
}

export const workshopModuleResolvers: WorkshopsModuleResolvers = {
    serverResolver: craftYardServerResolver,
    moduleResolver: {
        db: workshopsRepo
    }
}
