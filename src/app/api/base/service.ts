import { UserAR } from "../../../users/domain/user/aroot";
import { userRepo } from "../../../users/domain/user/repo";
import type { UserDod } from "../../app-domain/dod";
import type { Result } from "../../app-domain/types";
import type { Command } from "./types";

export abstract class BaseService<C extends Command> {
  abstract commandName: C['command'];

  abstract execute(dto: Command, currUserId: string): Promise<Result<any, any>>

  protected async getUserDod(userId: string): Promise<UserDod> {
    const user = await userRepo.findUser(userId);
    if (!user) throw new Error('User not found');
    return user;
  }

  protected async getUserAr(userId: string): Promise<UserAR> {
    const user = await userRepo.findUser(userId);
    if (!user) throw new Error('User not found');
    return new UserAR(user);
  }
}
