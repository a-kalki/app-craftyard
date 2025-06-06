import { BaseService } from "../../../../app/api/base/service";
import type { UserDod } from "../../../../app/app-domain/dod";
import { UserAR } from "../../../domain/user/aroot";
import type { EditUserByKeeterCommand, EditUserCommand, EditUserResult } from "../../../domain/user/contracts";
import { userRepo } from "../../../domain/user/repo";
import { userAccessRules } from "../../../domain/user/rules/access";

class EditUserService extends BaseService<EditUserCommand | EditUserByKeeterCommand> {
  commandName = "edit-user" as const;

  async execute(input: EditUserCommand | EditUserByKeeterCommand, currUserId: string): Promise<EditUserResult> {
    const currUser = await this.getUserAr(currUserId);
    const targetUser = await this.getUserAr(input.dto.id);

    const isSelf = userAccessRules.canEditSelf(currUser, targetUser);
    const isKeeterEditingOther = userAccessRules.canKeeterEditOther(currUser);

    if (!isSelf && !isKeeterEditingOther) {
      return { status: false, failure: 'access denied' };
    }

    const patch: Partial<UserDod> = {
      name: input.dto.name,
      telegramNickname: input.dto.telegramNickname,
      profile: input.dto.profile,
    };

    // только если KEETER редактирует другого пользователя
    if (isKeeterEditingOther) {
      patch.roleCounters = (input as EditUserByKeeterCommand).dto.roleCounters;
    }

    // проверка инвариантов
    new UserAR({...targetUser.getUserDod(), ...patch});
    await userRepo.editUser(input.dto.id, patch);
    return { status: true, success: 'success' };
  }
}

export const editUserService = new EditUserService();
