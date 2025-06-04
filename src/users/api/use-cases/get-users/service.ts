import { BaseService } from "../../../../app/api/base/service";
import type { FindUserCommand, GetUsersCommand, GetUsersResult } from "../../../domain/user/contracts";
import { userRepo } from "../../../domain/user/repo";

class GetUsersService extends BaseService<GetUsersCommand> {
  commandName = "get-users" as const;

  execute(input: FindUserCommand): Promise<GetUsersResult> {
    return userRepo.getUsers();
  }
}

export const getUsersService = new GetUsersService();
