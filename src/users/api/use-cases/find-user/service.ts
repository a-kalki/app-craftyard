import { BaseService } from "../../../../app/api/base/service";
import type { FindUserResult } from "../../../../app/ui/base-run/run-types";
import type { FindUserCommand } from "../../../domain/user/contracts";
import { userRepo } from "../../../domain/user/repo";

class FindUserService extends BaseService<FindUserCommand> {
  commandName = "find-user" as const;

  async execute(input: FindUserCommand): Promise<FindUserResult> {
    const user = await userRepo.findUser(input.dto.id);
    return user
      ? { status: true, success: user }
      : { status: false, failure: "User not found" };
  }
}

export const findUserService = new FindUserService();
