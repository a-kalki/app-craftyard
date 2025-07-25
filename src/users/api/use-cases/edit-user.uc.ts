import type { RequestScope, DomainResult } from "rilata/api";
import { failure, success, type ValidationError } from "rilata/core";
import { UserUseCase } from "#users/api/base-uc";
import type { EditUserCommand, EditUserMeta } from "#users/domain/user/struct/edit-user/contract";
import { UserAr } from "#users/domain/user/a-root";
import { UserPolicy } from "#users/domain/user/policy";
import type { UserAttrs } from "#users/domain/user/struct/attrs";
import { editUserValidator } from "#users/domain/user/struct/edit-user/v-map";

export class EditUserUseCase extends UserUseCase<EditUserMeta> {
  inputName = "edit-user" as const;

  arName = "UserAr" as const;

  name = "Edit User Use Case" as const;

  protected supportAnonimousCall = false;

  protected validator = editUserValidator;

  async runDomain(input: EditUserCommand, requestData: RequestScope): Promise<DomainResult<EditUserMeta>> {
    const targetUserResult = await this.getUserAttrs(input.attrs.id);
    if (targetUserResult.isFailure()) {
      return failure(
        {
          name: 'UserDoesNotExistError',
          type: 'domain-error',
        }
      )
    }
    const targetDbUser = targetUserResult.value;

    if (requestData.caller.type === 'AnonymousUser') return failure({
      name: 'Not Permitted Error',
      type: 'domain-error',
    })
    const userPolicy = new UserPolicy(requestData.caller);

    if (userPolicy.isModerator()) {
      return this.updateUser(input.attrs, targetDbUser, 'moderator');
    }

    if (userPolicy.canEdit(targetDbUser)) {
      return this.updateUser(input.attrs, targetDbUser, 'self');
    }

    return failure({
      name: 'Not Permitted Error',
      type: 'domain-error',
    })
  }

  protected async updateUser(
    inAttrs: EditUserCommand['attrs'],
    dbUser: UserAttrs,
    editType: 'self' | 'moderator',
  ): Promise<DomainResult<EditUserMeta>> {
    const patch: Partial<UserAttrs> = {
      name: inAttrs.name,
      profile: inAttrs.profile,
    };

    if (editType === 'moderator') {
      if (
        !inAttrs.statistics ||
        Object.keys(inAttrs.statistics).length === 0 ||
        Object.keys(inAttrs.statistics?.contributions).length === 0
      ) {
        const err: ValidationError = {
            errors: { statistics: [{ 
              name: 'Not empty object keys',
              hint: {},
              text: 'Объект не может быть пустым'
            }] },
            name: "Validation error",
            type: "app-error"
        }
        // @ts-expect-error: исключение для домена вернуть ошибку уровня приложения
        return failure(err)
      }
      patch.statistics = { contributions: inAttrs.statistics?.contributions };
    }

    // проверка инвариантов
    new UserAr({...dbUser, ...patch});
    const res = await this.moduleResolver.userRepo.updateUser(inAttrs.id, patch);
    if (res.changes > 0) {
      return success({ status: 'success' });
    }
    throw this.logger.error('Не удалось обновить пользователя', { inAttrs, patch, res })
  }
}
