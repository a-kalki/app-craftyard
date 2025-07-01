import { UserContentUseCase } from "#user-contents/api/base-uc";
import type { RequestScope, DomainResult } from "rilata/api";
import { editContentSectionValidator } from "./v-map";
import { failure, success, type AbstractAggregateAttrs } from "rilata/core";
import type { EditingIsNotPermittedError } from "#app/domain/errors";
import type { EditContentSectionCommand, EditContentSectionMeta } from "#user-contents/domain/section/struct/edit";
import type { ContentSectionAttrs } from "#user-contents/domain/section/struct/attrs";
import { ContentSectionAr } from "#user-contents/domain/section/a-root";

export class EditContentSectionUC extends UserContentUseCase<EditContentSectionMeta> {
  arName = "ContentSectionAr" as const;

  name = "Edit Content Section Use Case" as const;

  inputName = "edit-content-section" as const;

  protected supportAnonimousCall = false;

  protected validator = editContentSectionValidator;

  async runDomain(
    input: EditContentSectionCommand, requestData: RequestScope,
  ): Promise<DomainResult<EditContentSectionMeta>> {
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
    const canEdit = this.canAction(permissionCheckAttrs, requestData);
    if (!canEdit) {
      const notPermitError: EditingIsNotPermittedError = {
        name: "EditingIsNotPermittedError",
        description: 'Вам не разрешено редактировать данный контент.',
        type: "domain-error"
      }
      return failure(notPermitError);
    }
    return this.editContentSection(attrs, input);
  }

  protected async editContentSection(
    currAttrs: ContentSectionAttrs, input: EditContentSectionCommand
  ): Promise<DomainResult<EditContentSectionMeta>> {
    const ar = new ContentSectionAr(currAttrs); // check invariants;
    ar.editAttrs(input.attrs);

    const repo = this.moduleResolver.contentSectionRepo;
    const result = await repo.updateContentSection(currAttrs.id, ar.getAttrs());
    if (result.changes === 0) {
      throw this.serverResolver.logger.error(
        `[${this.constructor.name}]: fail to edited record at thesis set repo`,
        { currAttrs, newAttrs: ar.getAttrs() }
      )
    }
    return success('success');
  }
}
