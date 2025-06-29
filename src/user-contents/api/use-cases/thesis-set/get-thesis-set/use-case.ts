import type { RequestScope, DomainResult } from "rilata/api";
import { UserContentUseCase } from "#user-contents/api/base-uc";
import type { GetThesisSetCommand, GetThesisSetMeta } from "#user-contents/domain/thesis-set/struct/thesis-set/get";
import { getThesisSetValidator } from "./v-map";
import { failure, success } from "rilata/core";

export class GetThesisSetUC extends UserContentUseCase<GetThesisSetMeta> {
  arName = "ThesisSetAr" as const;

  name = "Get Thesis Set Use Case" as const;

  inputName = "get-thesis-set" as const;

  protected supportAnonimousCall = true;

  protected validator = getThesisSetValidator;

  async runDomain(
    input: GetThesisSetCommand, reqScope: RequestScope,
  ): Promise<DomainResult<GetThesisSetMeta>> {
    const { id } = input.attrs;
    const res = await this.getThesisSetAttrs(id);
    if (res.isFailure()) return res;

    return await this.canAction(res.value, reqScope)
      ? success(res.value)
      : failure({
        name: 'GettingIsNotPermittedError',
        description: 'Вам не разрешено просматривать этот контент',
        type: 'domain-error',
      });
  }
}
