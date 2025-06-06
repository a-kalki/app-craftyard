import { BaseRootController } from "../../app/api/base/base-root-controller";
import type { BaseService } from "../../app/api/base/service";
import type { Command } from "../../app/api/base/types";
import { usersEndpoint } from "../domain/constants";
import { editUserService } from "./use-cases/edit-user/service";
import { findUserService } from "./use-cases/find-user/service";
import { getUsersService } from "./use-cases/get-users/service";
import { registerUserService } from "./use-cases/register-user/service";

class UsersRoot extends BaseRootController {
    rootEndpoint = usersEndpoint;

    services: BaseService<Command>[] = [
      findUserService,
      registerUserService,
      getUsersService,
      editUserService
    ];
}

export const usersRoot = new UsersRoot();
