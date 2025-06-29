import { UserContentUseCase } from "#user-contents/api/base-uc";
import type { EditThesisSetCommand, EditThesisSetMeta } from "#user-contents/domain/thesis-set/struct/thesis-set/edit";
import type { RequestScope, DomainResult } from "rilata/api";
import { editThesisSetValidator } from "./v-map";
import type { AbstractAggregateAttrs } from "rilata/api-server";
import { failure, success } from "rilata/core";
import type { EditingIsNotPermittedError } from "#app/domain/errors";
import { ThesisSetAr } from "#user-contents/domain/thesis-set/a-root";
import type { ThesisSetAttrs } from "#user-contents/domain/thesis-set/struct/attrs";

export class EditThesisSetUC extends UserContentUseCase<EditThesisSetMeta> {
  arName = "ThesisSetAr" as const;

  name = "Edit Thesis Set Use Case" as const;

  inputName = "edit-thesis-set" as const;

  protected supportAnonimousCall = false;

  protected validator = editThesisSetValidator;

  async runDomain(
    input: EditThesisSetCommand, requestData: RequestScope,
  ): Promise<DomainResult<EditThesisSetMeta>> {
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
    const canEdit = this.canAction(permissionCheckAttrs, requestData);
    if (!canEdit) {
      const notPermitError: EditingIsNotPermittedError = {
        name: "EditingIsNotPermittedError",
        description: 'Вам не разрешено редактировать данный контент.',
        type: "domain-error"
      }
      return failure(notPermitError);
    }
    return this.editThesisSet(attrs, input);
  }

  protected async editThesisSet(
    currAttrs: ThesisSetAttrs, input: EditThesisSetCommand
  ): Promise<DomainResult<EditThesisSetMeta>> {
    const newAttrs = { ...currAttrs, ...input.attrs };
    new ThesisSetAr(newAttrs); // check invariants;

    const repo = this.moduleResolver.thesisSetRepo;
    const result = await repo.updateThesisSet(newAttrs.id, newAttrs);
    if (result.changes === 0) {
      throw this.serverResolver.logger.error(
        `[${this.constructor.name}]: fail to edited record at thesis set repo`,
        { currAttrs, newAttrs }
      )
    }
    return success('success');
  }
}
