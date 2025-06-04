import { BaseRoot } from "../../app/api/base/root";
import type { BaseService } from "../../app/api/base/service";
import type { Command } from "../../app/api/base/types";
import { findUserService } from "./use-cases/find-user/service";
import { registerUserService } from "./use-cases/register-user/service";

export class UsersRoot extends BaseRoot {
    rootName: string = 'users';

    services: BaseService<Command>[] = [
      findUserService,
      registerUserService
    ];
}
