import type { RequestScope, DomainResult } from "rilata/api";
import { failure, success, type AbstractAggregateAttrs } from "rilata/core";
import type { DeletingIsNotPermittedError } from "#app/domain/errors";
import { UserContentUseCase } from "#user-contents/api/base-uc";
import type { DeleteThesisSetCommand, DeleteThesisSetMeta } from "#user-contents/domain/thesis-set/struct/thesis-set/delete";
import { deleteThesisSetValidator } from "./v-map";

export class DeleteThesisSetUC extends UserContentUseCase<DeleteThesisSetMeta> {
  arName = "ThesisSetAr" as const;

  name = "Delete Thesis Set Use Case" as const;

  inputName = "delete-thesis-set" as const;

  protected supportAnonimousCall = false;

  protected validator = deleteThesisSetValidator;

  async runDomain(
    input: DeleteThesisSetCommand, requestData: RequestScope,
  ): Promise<DomainResult<DeleteThesisSetMeta>> {
    const { id } = input.attrs;
    const getResult = await this.getThesisSetAttrs(id);
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

    const repo = this.moduleResolver.thesisSetRepo;
    const result = await repo.deleteThesisSet(id);
    if (result.changes === 0) {
      throw this.serverResolver.logger.error(
        `[${this.constructor.name}]: fail to deleted record at thesis set repo`,
        { attrs }
      )
    }
    return success('success');
  }
}
