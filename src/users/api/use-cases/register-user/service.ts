import { BaseService } from "../../../../app/api/base/service";
import type { UserDod } from "../../../../app/app-domain/dod";
import type { RegisterUserResult } from "../../../../app/ui/base-run/run-types";
import { UserAR } from "../../../domain/user/aroot";
import type { RegisterUserCommand } from "../../../domain/user/contracts";
import { userRepo } from "../../../domain/user/repo";

class RegisterUserService extends BaseService<RegisterUserCommand> {
  commandName = "register-user" as const;

  async execute(input: RegisterUserCommand): Promise<RegisterUserResult> {
    const userDod: UserDod = {
      id: input.dto.id,
      name: input.dto.name,
      telegramNickname: input.dto.telegramNickname,
      roleCounters: ['ONLOOKER'],
      profile: {
        skills: {},
        avatarUrl: input.dto.avatarUrl
      },
      joinedAt: Date.now(),
    }
    try {
      new UserAR(userDod);
      await userRepo.add(userDod);
      return { status: true, success: 'success' };
    } catch (err) {
      console.error(err);
      return { status: false, failure: 'fail' };
    }
  }
}

export const registerUserService = new RegisterUserService();

