import { UserContentUseCase } from "#user-contents/api/base-uc";
import type { RequestScope, DomainResult } from "rilata/api";
import { editThesisValidator } from "./v-map";
import type { AbstractAggregateAttrs } from "rilata/api-server";
import { failure, success } from "rilata/core";
import type { EditingIsNotPermittedError } from "#app/domain/errors";
import type { EditThesisCommand, EditThesisMeta } from "#user-contents/domain/thesis-set/struct/thesis/edit";
import { ThesisSetAr } from "#user-contents/domain/thesis-set/a-root";

export class EditThesisUC extends UserContentUseCase<EditThesisMeta> {
  arName = "ThesisSetAr" as const;

  name = "Edit Thesis Use Case" as const;

  inputName = "edit-thesis" as const;

  protected supportAnonimousCall = false;

  protected validator = editThesisValidator;

  async runDomain(
    input: EditThesisCommand, requestData: RequestScope,
  ): Promise<DomainResult<EditThesisMeta>> {
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
    const canEdit = await this.canAction(permissionCheckArAttrs, requestData);
    if (!canEdit) {
      const notPermitError: EditingIsNotPermittedError = {
        name: "EditingIsNotPermittedError",
        description: 'Вам не разрешено редактировать контент.',
        type: "domain-error"
      }
      return failure(notPermitError);
    }

    const ar = new ThesisSetAr(aRootAttrs);
    const editResult = ar.editThesis(input.attrs.thesis);
    if (editResult.isFailure()) return failure(editResult.value);

    const repo = this.moduleResolver.thesisSetRepo;
    const updateResult = await repo.updateThesisSet(id, ar.getAttrs());
    if (updateResult.changes === 0) {
      throw this.serverResolver.logger.error(
        `[${this.constructor.name}]: fail to edited record at thesis set repo`,
        { attrs: ar.getAttrs() }
      )
    }
    return success('success');
  }
}
