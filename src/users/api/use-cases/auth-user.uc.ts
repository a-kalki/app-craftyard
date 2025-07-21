import { createHash, createHmac } from "crypto";
import type { RequestScope, DomainResult } from "rilata/api";
import { AssertionException, failure, success, type BackendResultByMeta, type JwtDto } from "rilata/core";
import { UserUseCase } from "#users/api/base-uc";
import type { AuthUserMeta } from "#app/domain/user/struct/auth-user/contract";
import { UserAr } from "#app/domain/user/a-root";
import { TELEGRAM_AUTH_TIME_AS_SEC } from "#app/ui/base-run/constants";
import type { TelegramUser } from "#app/ui/base-run/run-types";
import type { UserAttrs } from "#app/domain/user/struct/attrs";
import { authUserValidator } from "#app/domain/user/struct/auth-user/v-map";
import type { UserArMeta } from "#app/domain/user/meta";
import type { AddContentSectionCommand, AddContentSectionMeta } from "#user-contents/domain/section/struct/add-section/contract";
import { dedokWorkshopId } from "#workshop/constants";

export class AuthUserUseCase extends UserUseCase<AuthUserMeta> {
  inputName = "auth-user" as const;

  arName = "UserAr" as const;

  name = "Auth User Use Case" as const;

  protected supportAnonimousCall = true;

  protected validator = authUserValidator;

  async runDomain(input: AuthUserMeta['in'], requestData: RequestScope): Promise<DomainResult<AuthUserMeta>> {
    if (!this.checkHash(input.attrs.data)) {
      return failure({
        name: 'Auth Hash Not Valid',
        type: 'domain-error',
      })
    }
    const tgUser = this.getTgUser(input);

    const getResult = await this.getUserAttrs(tgUser.id);
    if (getResult.isFailure()) {
      return this.registerUser(tgUser, input.requestId);
    }

    const currUser = getResult.value;
    return success({
      user: currUser,
      tokens: {
        access: this.createToken(currUser, 'access'),
        refresh: this.createToken(currUser, 'refresh'),
      }
    })
  }

  protected getTgUser(input: AuthUserMeta['in']): TelegramUser {
    const params = new URLSearchParams(input.attrs.data);
    let tgUser: URLSearchParams;

    if (input.attrs.type === 'widget-login') {
      tgUser = params;
    } else {
      tgUser = new URLSearchParams(params.get('user') ?? '');
    }
    const id = tgUser.get('id');
    if (!id) throw new AssertionException('tg user not valid');
    return {
      id,
      first_name: tgUser.get('first_name') ?? 'Ваше имя',
      username: tgUser.get('username') ?? undefined,
      photo_url: tgUser.get('photo_url') ?? undefined,
    }
  }

  protected checkHash(inputAsString: string): boolean {
    const params = new URLSearchParams(inputAsString);
    if (this.serverResolver.runMode !== 'production' && params.get('hash') === 'debug') return true; 

    const authDate = params.get('auth_date');
    if (!authDate) return false;

    const authDateAsMs = Number(authDate) * 1000; // Telegram uses seconds
    if (Date.now() - authDateAsMs > TELEGRAM_AUTH_TIME_AS_SEC * 1000) {
      return false;
    }

    const hash = params.get('hash');
    if (!hash) return false;

    params.delete('hash');
    const dataCheckString = Array.from(params.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join('\n');

    const botToken = this.serverResolver.appBotToken;
    const secret = createHash('sha256').update(botToken).digest(); // ключ для HMAC
    const computedHash = createHmac('sha256', secret)
      .update(dataCheckString)
      .digest('hex');
    return hash === computedHash;
  }

  protected async registerUser(
    tgUser: TelegramUser, reqId: string
  ): Promise<DomainResult<AuthUserMeta>> {
    const createSkillResult = await this.createSkillsContentSection(tgUser.id, reqId)
    if (createSkillResult.isFailure()) {
      throw this.logger.error(
        `[${this.constructor.name}]: Не удалось создать секцию контента для навыков.`,
        { result: createSkillResult.toObject(), reqId }
      );
    }

    const userAttrs: UserAttrs = {
      id: tgUser.id,
      name: tgUser.first_name,
      profile: {
        telegramNickname: tgUser.username,
        avatarUrl: tgUser.photo_url,
        skillsContentSectionId: createSkillResult.value.id,
      },
      statistics: {
        contributions: {
          NEWBIE: {
            count: 0,
            firstAt: Date.now(),
            lastAt: Date.now(),
          }
        }
      },
      createAt: Date.now(),
      updateAt: Date.now(),
      bindWorkshopId: dedokWorkshopId,
    }

    const user = new UserAr(userAttrs);
    const result = await this.moduleResolver.userRepo.add(userAttrs);
    if (result.changes > 0) {
      return success({
        user: user.getAttrs(),
        tokens: {
          access: this.createToken(userAttrs, 'access'),
          refresh: this.createToken(userAttrs, 'refresh'),
        },
      })
    }
    throw new AssertionException('БД вернула неожиданный результат: ' + JSON.stringify(result));
  }

  protected createSkillsContentSection(
    userId: string, reqId: string
  ): Promise<BackendResultByMeta<AddContentSectionMeta>> {
    const ownerName: UserArMeta['name'] = 'UserAr';
    const commandAttrs: AddContentSectionCommand['attrs'] = {
      access: 'public',
      ownerId: userId,
      ownerName,
      context: 'user-info',
      title: "Навыки"
    }
    return this.moduleResolver.userContentFacade.addContentSection(
      commandAttrs, { type: 'AnonymousUser' }, reqId
    );
  }

  protected createToken(user: UserAttrs, tokenType: 'access' | 'refresh'): string {
    const dto: JwtDto = { id: user.id }
    if (user.support?.isModerator) dto.support = { isModerator: true }
    return this.serverResolver.jwtCreator.createToken(dto, tokenType);
  }
}

