import type { RequestScope, DomainResult } from "rilata/api";
import { failure, success, type AbstractAggregateAttrs } from "rilata/core";
import type { DeletingIsNotPermittedError } from "#app/domain/errors";
import { UserContentUseCase } from "#user-contents/api/base-uc";
import type { DeleteContentSectionCommand, DeleteContentSectionMeta } from "#user-contents/domain/section/struct/delete-section/contract";
import { deleteContentSectionValidator } from "#user-contents/domain/section/struct/delete-section/v-map";

export class DeleteContentSectionUC extends UserContentUseCase<DeleteContentSectionMeta> {
  arName = "ContentSectionAr" as const;

  name = "Delete Content Section Use Case" as const;

  inputName = "delete-content-section" as const;

  protected supportAnonimousCall = false;

  protected validator = deleteContentSectionValidator;

  async runDomain(
    input: DeleteContentSectionCommand, requestData: RequestScope,
  ): Promise<DomainResult<DeleteContentSectionMeta>> {
    const { id } = input.attrs;
    const getResult = await this.getContentSectionAttrs(id);
    if (getResult.isFailure()) return failure(getResult.value);
    const attrs = getResult.value;

    const permissionCheckAttrs: AbstractAggregateAttrs = {
      id,
      ownerId: attrs.ownerId,
      ownerName: attrs.ownerName,
      context: attrs.context,
      access: attrs.access,
    }
    const canDelete = await this.canAction(permissionCheckAttrs, requestData);
    if (!canDelete) {
      const notPermitError: DeletingIsNotPermittedError = {
        name: "DeletingIsNotPermittedError",
        description: 'Вам не разрешено удалять данный контент.',
        type: "domain-error"
      }
      return failure(notPermitError);
    }

    const repo = this.moduleResolver.contentSectionRepo;
    const result = await repo.deleteContentSection(id);
    if (result.changes === 0) {
      throw this.serverResolver.logger.error(
        `[${this.constructor.name}]: fail to deleted record at thesis set repo`,
        { attrs }
      )
    }
    return success('success');
  }
}
