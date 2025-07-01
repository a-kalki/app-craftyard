import { UserContentUseCase } from "#user-contents/api/base-uc";
import type { RequestScope, DomainResult } from "rilata/api";
import { failure, success, type AbstractAggregateAttrs } from "rilata/core";
import type { DeletingIsNotPermittedError } from "#app/domain/errors";
import type { DeleteUserContentCommand, DeleteUserContentMeta } from "#user-contents/domain/content/struct/delete-content/contract";
import { deleteUserContentValidator } from "#user-contents/domain/content/struct/delete-content/v-map";

export class DeleteUserContentUC extends UserContentUseCase<DeleteUserContentMeta> {
  arName = "UserContentAr" as const;

  name = "Delete User Content Use Case" as const;

  inputName = "delete-user-content" as const;

  protected supportAnonimousCall = false;

  protected validator = deleteUserContentValidator;

  async runDomain(
    input: DeleteUserContentCommand, requestData: RequestScope,
  ): Promise<DomainResult<DeleteUserContentMeta>> {
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
    const canDelete = await this.canAction(permissionCheckArAttrs, requestData);
    if (!canDelete) {
      const notPermitError: DeletingIsNotPermittedError = {
        name: 'DeletingIsNotPermittedError',
        description: 'Вам не разрешено удалять контент.',
        type: "domain-error"
      }
      return failure(notPermitError);
    }

    const deleteResult = await this.getUserContentRepo().deleteContent(contentId);
    if (deleteResult.changes === 0) {
      throw this.logger.error(
        `[${this.constructor.name}]: dont delete user content record`,
        { sectionId, contentId }
      );
    }
    return success('success');
  }
}
