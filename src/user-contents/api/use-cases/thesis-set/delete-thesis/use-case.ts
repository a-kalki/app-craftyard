import { UserContentUseCase } from "#user-contents/api/base-uc";
import type { RequestScope, DomainResult } from "rilata/api";
import { deleteThesisValidator } from "./v-map";
import { failure, success, type AbstractAggregateAttrs } from "rilata/core";
import type { DeleteThesisCommand, DeleteThesisMeta } from "#user-contents/domain/thesis-set/struct/thesis/delete";
import { ThesisSetAr } from "#user-contents/domain/thesis-set/a-root";
import type { DeletingIsNotPermittedError } from "#app/domain/errors";

export class DeleteThesisUC extends UserContentUseCase<DeleteThesisMeta> {
  arName = "ThesisSetAr" as const;

  name = "Delete Thesis Use Case" as const;

  inputName = "delete-thesis" as const;

  protected supportAnonimousCall = false;

  protected validator = deleteThesisValidator;

  async runDomain(
    input: DeleteThesisCommand, requestData: RequestScope,
  ): Promise<DomainResult<DeleteThesisMeta>> {
    const { id } = input.attrs;
    const getResult = await this.getThesisSetAttrs(id);
    if (getResult.isFailure()) return failure(getResult.value);
    const aRootAttrs = getResult.value;

    const permissionCheckArAttrs: AbstractAggregateAttrs = {
      id,
      ownerId: aRootAttrs.ownerId,
      ownerName: aRootAttrs.ownerName,
      context: aRootAttrs.context,
      access: aRootAttrs.access,
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

    const ar = new ThesisSetAr(aRootAttrs);
    ar.deleteThesis(input.attrs.thesisId);

    const repo = this.moduleResolver.thesisSetRepo;
    const result = await repo.updateThesisSet(ar.getId(), ar.getAttrs());
    if (result.changes === 0) {
      throw this.serverResolver.logger.error(
        `[${this.constructor.name}]: fail to update record at thesis set repo`,
        { id: ar.getId(), attrs: ar.getAttrs() }
      )
    }
    return success('success');
  }
}
