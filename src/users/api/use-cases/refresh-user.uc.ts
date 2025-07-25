import type { RequestScope, DomainResult } from "rilata/api";
import { AssertionException, failure, success, type UcResult } from "rilata/core";
import { UserUseCase } from "#users/api/base-uc";
import type { RefreshUserCommand, RefreshUserMeta } from "#users/domain/user/struct/refresh-user/contract";
import { refreshUserValidator } from "#users/domain/user/struct/refresh-user/v-map";

export class RefreshUserUseCase extends UserUseCase<RefreshUserMeta> {
  inputName = "refresh-user" as const;

  arName = "UserAr" as const;

  name = "Refresh User Use Case" as const;

  protected supportAnonimousCall = true;

  protected validator = refreshUserValidator;

  async executeService(
    input: RefreshUserMeta['in'], requestData: RequestScope,
  ): Promise<UcResult<RefreshUserMeta>> {
    const verifyResult = this.serverResolver.jwtVerifier.verifyToken(input.attrs.refreshToken);
    if (verifyResult.isFailure()) return failure({
      name: 'Jwt verify error',
      type: 'app-error',
    });

    const JwtUserDto = verifyResult.value;
    return success({
      accessToken: this.serverResolver.jwtCreator.createToken(JwtUserDto, 'access')
    });
  }

  runDomain(input: RefreshUserCommand, requestData: RequestScope): Promise<DomainResult<RefreshUserMeta>> {
    throw new AssertionException('not domain logic');
  }
}

