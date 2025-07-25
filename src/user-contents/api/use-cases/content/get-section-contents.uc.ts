import { UserContentUseCase } from "#user-contents/api/base-uc";
import type { RequestScope, DomainResult } from "rilata/api";
import { failure, success, type AbstractAggregateAttrs } from "rilata/core";
import type { GettingIsNotPermittedError } from "#app/core/errors";
import type { GetSectionContentsCommand, GetSectionContentsMeta } from "#user-contents/domain/content/struct/get-section-contents/contract";
import { getSectionContentsValidator } from "#user-contents/domain/content/struct/get-section-contents/v-map";

export class GetSectionContentsUC extends UserContentUseCase<GetSectionContentsMeta> {
  arName = "UserContentAr" as const;

  name = "Get Section Contents Use Case" as const;

  inputName = "get-section-user-contents" as const;

  protected supportAnonimousCall = true;

  protected validator = getSectionContentsValidator;

  async runDomain(
    input: GetSectionContentsCommand, requestData: RequestScope,
  ): Promise<DomainResult<GetSectionContentsMeta>> {
    const { sectionId } = input.attrs;
    const getResult = await this.getContentSectionAttrs(sectionId);
    if (getResult.isFailure()) return failure(getResult.value);
    const sectionAttrs = getResult.value;

    const permissionCheckArAttrs: AbstractAggregateAttrs = {
      id: sectionId,
      ownerId: sectionAttrs.ownerId,
      ownerName: sectionAttrs.ownerName,
      context: sectionAttrs.context,
      access: sectionAttrs.access,
    }
    const canEdit = await this.canAction(permissionCheckArAttrs, requestData);
    if (!canEdit) {
      const notPermitError: GettingIsNotPermittedError = {
        name: 'GettingIsNotPermittedError',
        description: 'Вам не разрешено просматривать контент.',
        type: "domain-error"
      }
      return failure(notPermitError);
    }

    const contents = await this.getUserContentRepo().filterContent({ sectionId });
    return success(contents);
  }
}
