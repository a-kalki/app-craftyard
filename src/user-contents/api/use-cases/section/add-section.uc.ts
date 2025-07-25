import { UserContentUseCase } from "#user-contents/api/base-uc";
import type { RequestScope, DomainResult } from "rilata/api";
import { uuidUtility } from "rilata/api-helper";
import { failure, success, type AbstractAggregateAttrs } from "rilata/core";
import type { AddingIsNotPermittedError } from "#app/core/errors";
import type { ContentSectionAttrs } from "#user-contents/domain/section/struct/attrs";
import { ContentSectionAr } from "#user-contents/domain/section/a-root";
import type { AddContentSectionCommand, AddContentSectionMeta } from "#user-contents/domain/section/struct/add-section/contract";
import { addContentSectionValidator } from "#user-contents/domain/section/struct/add-section/v-map";

export class AddContentSectionUC extends UserContentUseCase<AddContentSectionMeta> {
  arName = "ContentSectionAr" as const;

  name = "Add Content Section Use Case" as const;

  inputName = "add-content-section" as const;

  protected supportAnonimousCall = false;

  protected validator = addContentSectionValidator;

  async runDomain(
    input: AddContentSectionCommand, requestData: RequestScope,
  ): Promise<DomainResult<AddContentSectionMeta>> {
    const id = uuidUtility.getNewUuidV7();
    const permissionCheckAttrs: AbstractAggregateAttrs = {
      id,
      ownerId: input.attrs.ownerId,
      ownerName: input.attrs.ownerName,
      context: input.attrs.context,
      access: input.attrs.access
    }
    const canEdit = await this.canAction(permissionCheckAttrs, requestData);
    if (!canEdit) {
      const notPermitError: AddingIsNotPermittedError = {
        name: 'AddingIsNotPermittedError',
        description: 'Вам не разрешено добавлять контент.',
        type: "domain-error"
      }
      return failure(notPermitError);
    }
    return this.addContentSection(id, input);
  }

  protected async addContentSection(id: string, input: AddContentSectionCommand): Promise<DomainResult<AddContentSectionMeta>> {
    const attrs: ContentSectionAttrs = {
      id,
      ... input.attrs,
      createAt: Date.now(),
      updateAt: Date.now(),
    }
    if (input.attrs.order) attrs.order = input.attrs.order;
    if (input.attrs.icon) attrs.icon = input.attrs.icon;
    new ContentSectionAr(attrs); // check invariants;

    const repo = this.moduleResolver.contentSectionRepo;
    const result = await repo.addContentSection(attrs);
    if (result.changes === 0) {
      throw this.serverResolver.logger.error(
        `[${this.constructor.name}]: fail to added record at thesis set repo`,
        { attrs }
      )
    }
    return success({ id });
  }
}
