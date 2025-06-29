import { UserContentUseCase } from "#user-contents/api/base-uc";
import type { AddThesisSetCommand, AddThesisSetMeta } from "#user-contents/domain/thesis-set/struct/thesis-set/add";
import type { RequestScope, DomainResult } from "rilata/api";
import { addThesisSetValidator } from "./v-map";
import type { AbstractAggregateAttrs } from "rilata/api-server";
import { uuidUtility } from "rilata/api-helper";
import { failure, success } from "rilata/core";
import type { AddingIsNotPermittedError } from "#app/domain/errors";
import type { ThesisSetAttrs } from "#user-contents/domain/thesis-set/struct/attrs";
import { ThesisSetAr } from "#user-contents/domain/thesis-set/a-root";

export class AddThesisSetUC extends UserContentUseCase<AddThesisSetMeta> {
  arName = "ThesisSetAr" as const;

  name = "Add Thesis Set Use Case" as const;

  inputName = "add-thesis-set" as const;

  protected supportAnonimousCall = false;

  protected validator = addThesisSetValidator;

  async runDomain(
    input: AddThesisSetCommand, requestData: RequestScope,
  ): Promise<DomainResult<AddThesisSetMeta>> {
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
    return this.addThesisSet(id, input);
  }

  protected async addThesisSet(id: string, input: AddThesisSetCommand): Promise<DomainResult<AddThesisSetMeta>> {
    const attrs: ThesisSetAttrs = {
      id,
      ... input.attrs,
      theses: [],
      createAt: Date.now(),
      updateAt: Date.now(),
      type: 'thesis-set',
    }
    if (input.attrs.order) attrs.order = input.attrs.order;
    if (input.attrs.icon) attrs.icon = input.attrs.icon;
    new ThesisSetAr(attrs); // check invariants;

    const repo = this.moduleResolver.thesisSetRepo;
    const result = await repo.addThesisSet(attrs);
    if (result.changes === 0) {
      throw this.serverResolver.logger.error(
        `[${this.constructor.name}]: fail to added record at thesis set repo`,
        { attrs }
      )
    }
    return success({ id });
  }
}
