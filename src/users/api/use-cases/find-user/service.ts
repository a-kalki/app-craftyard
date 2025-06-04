import { BaseService } from "../../../../app/api/base/service";
import type { FindUserCommand, FindUserResult } from "../../../domain/user/contracts";
import { userRepo } from "../../../domain/user/repo";

class FindUserService extends BaseService<FindUserCommand> {
  commandName = "find-user" as const;

  execute(input: FindUserCommand): Promise<FindUserResult> {
    return userRepo.findUser(input.dto.id);
  }
}

export const findUserService = new FindUserService();
