import type { RequestScope, DomainResult } from "rilata/api";
import { UserContentUseCase } from "#user-contents/api/base-uc";
import { getContentSectionValidator } from "./v-map";
import { failure, success } from "rilata/core";
import type { GetContentSectionCommand, GetContentSectionMeta } from "#user-contents/domain/section/struct/get";

export class GetContentSectionUC extends UserContentUseCase<GetContentSectionMeta> {
  arName = "ContentSectionAr" as const;

  name = "Get Content Section Use Case" as const;

  inputName = "get-content-section" as const;

  protected supportAnonimousCall = true;

  protected validator = getContentSectionValidator;

  async runDomain(
    input: GetContentSectionCommand, reqScope: RequestScope,
  ): Promise<DomainResult<GetContentSectionMeta>> {
    const { id } = input.attrs;
    const res = await this.getContentSectionAttrs(id);
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
