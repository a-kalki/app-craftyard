import { BaseService } from "../../../../app/api/base/service";
import type { GetUsersCommand, GetUsersResult } from "../../../domain/user/contracts";
import { userRepo } from "../../../domain/user/repo";

class GetUsersService extends BaseService<GetUsersCommand> {
  commandName = "get-users" as const;

  async execute(input: GetUsersCommand): Promise<GetUsersResult> {
    return { status: true, success: await userRepo.getUsers() };
  }
}

export const getUsersService = new GetUsersService();
