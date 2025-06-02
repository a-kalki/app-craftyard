import { BaseRoot } from "./base/root";
import type { BaseService } from "./base/service";
import type { Command } from "./base/types";
import { findUserService } from "./use-cases/find-user/service";
import { registerUserService } from "./use-cases/register-user/service";

export class UsersRoot extends BaseRoot {
    rootName: string = 'users';

    services: BaseService<Command>[] = [
      findUserService,
      registerUserService
    ];
}
