import { UserContentUseCase } from "#user-contents/api/base-uc";
import type { RequestScope, DomainResult } from "rilata/api";
import { failure, success, type AbstractAggregateAttrs } from "rilata/core";
import type { GettingIsNotPermittedError } from "#app/core/errors";
import type { GetUserContentCommand, GetUserContentMeta } from "#user-contents/domain/content/struct/get-content/contract";
import { getUserContentValidator } from "#user-contents/domain/content/struct/get-content/v-map";

export class GetUserContentUC extends UserContentUseCase<GetUserContentMeta> {
  arName = "UserContentAr" as const;

  name = "Get User Content Use Case" as const;

  inputName = "get-user-content" as const;

  protected supportAnonimousCall = true;

  protected validator = getUserContentValidator;

  async runDomain(
    input: GetUserContentCommand, requestData: RequestScope,
  ): Promise<DomainResult<GetUserContentMeta>> {
    const { sectionId, contentId } = input.attrs;
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

    const content = await this.getUserContentRepo().findContent(contentId);
    if (content) return success(content);
    return failure({
      name: 'AggregateDoesNotExistError',
      description: 'Контент с таким id в агрегате не найден.',
      type: 'domain-error',
    });
  }
}
