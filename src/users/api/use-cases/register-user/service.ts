import { BaseService } from "../../../../app/api/base/service";
import type { RegisterUserCommand, RegisterUserResult } from "../../../domain/user/contracts";
import { userRepo } from "../../../domain/user/repo";

class RegisterUserService extends BaseService<RegisterUserCommand> {
  commandName = "register-user" as const;

  execute(input: RegisterUserCommand): Promise<RegisterUserResult> {
    return userRepo.add(input.dto);
  }
}

export const registerUserService = new RegisterUserService();

