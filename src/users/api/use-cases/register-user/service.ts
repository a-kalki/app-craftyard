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
      statusStats: {
        NEWBIE: {
          count: 0,
          firstAt: Date.now(),
          lastAt: Date.now(),
        }
      },
      profile: {
        skills: {},
        telegramNickname: input.dto.telegramNickname,
        avatarUrl: input.dto.avatarUrl
      },
      joinedAt: Date.now(),
    }
    try {
      new UserAR(userDod); // invariants;
      await userRepo.add(userDod);
      return { status: true, success: 'success' };
    } catch (err) {
      console.error('Register user error:', err);
      return { status: false, failure: (err as Error).message };
    }
  }
}

export const registerUserService = new RegisterUserService();

