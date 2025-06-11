import { BaseService } from "../../../../app/api/base/service";
import type { UserDod } from "../../../../app/app-domain/dod";
import { UserAR } from "../../../domain/user/aroot";
import type { EditUserByModeratorCommand, EditUserCommand, EditUserResult } from "../../../domain/user/contracts";
import { userRepo } from "../../../domain/user/repo";
import { userAccessRules } from "../../../domain/user/rules/access";

class EditUserService extends BaseService<EditUserCommand | EditUserByModeratorCommand> {
  commandName = "edit-user" as const;

  async execute(input: EditUserCommand | EditUserByModeratorCommand, currUserId: string): Promise<EditUserResult> {
    const currUser = await this.getUserAr(currUserId);
    const targetUser = await this.getUserAr(input.dto.id);

    const isSelf = userAccessRules.canEditSelf(currUser, targetUser);
    const isModeratorEditingOther = userAccessRules.canModeratorEditOther(currUser);

    if (!isSelf && !isModeratorEditingOther) {
      return { status: false, failure: 'access denied' };
    }

    const patch: Partial<UserDod> = {
      name: input.dto.name,
      profile: input.dto.profile,
    };

    // только если MODERATOR редактирует другого пользователя
    if (isModeratorEditingOther) {
      patch.contributions = (input as EditUserByModeratorCommand).dto.contributions;
    }

    try {
      // проверка инвариантов
      new UserAR({...targetUser.getUserDod(), ...patch});
      await userRepo.editUser(input.dto.id, patch);
      return { status: true, success: 'success' };
    } catch (err) {
      console.log('EditUserService error', err);
      return { status: false, failure: (err as Error).message };
    }
  }
}

export const editUserService = new EditUserService();
