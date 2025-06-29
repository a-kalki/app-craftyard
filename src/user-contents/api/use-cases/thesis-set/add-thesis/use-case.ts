import { UserContentUseCase } from "#user-contents/api/base-uc";
import type { RequestScope, DomainResult } from "rilata/api";
import { addThesisValidator } from "./v-map";
import type { AbstractAggregateAttrs } from "rilata/api-server";
import { failure, success } from "rilata/core";
import type { AddingIsNotPermittedError } from "#app/domain/errors";
import type { AddThesisCommand, AddThesisMeta } from "#user-contents/domain/thesis-set/struct/thesis/add";
import type { Thesis, ThesisSetAttrs } from "#user-contents/domain/thesis-set/struct/attrs";
import { ThesisSetAr } from "#user-contents/domain/thesis-set/a-root";
import { uuidUtility } from "rilata/api-helper";

export class AddThesisUC extends UserContentUseCase<AddThesisMeta> {
  arName = "ThesisSetAr" as const;

  name = "Add Thesis Use Case" as const;

  inputName = "add-thesis" as const;

  protected supportAnonimousCall = false;

  protected validator = addThesisValidator;

  async runDomain(
    input: AddThesisCommand, requestData: RequestScope,
  ): Promise<DomainResult<AddThesisMeta>> {
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
    const canAdd = await this.canAction(permissionCheckArAttrs, requestData);
    if (!canAdd) {
      const notPermitError: AddingIsNotPermittedError = {
        name: 'AddingIsNotPermittedError',
        description: 'Вам не разрешено добавлять контент.',
        type: "domain-error"
      }
      return failure(notPermitError);
    }
    return this.addThesis(aRootAttrs, input);
  }

  protected async addThesis(
    arAttrs: ThesisSetAttrs, input: AddThesisCommand,
  ): Promise<DomainResult<AddThesisMeta>> {
    const newThesis: Thesis = {
      id: uuidUtility.getNewUuidV7(),
      ...input.attrs.newThesisAttrs,
      createAt: Date.now(),
      updateAt: Date.now(),
    }
    const aRoot = new ThesisSetAr(arAttrs);
    aRoot.addThesis(newThesis);

    const repo = this.moduleResolver.thesisSetRepo;
    const result = await repo.updateThesisSet(arAttrs.id, aRoot.getAttrs());
    if (result.changes === 0) {
      throw this.serverResolver.logger.error(
        `[${this.constructor.name}]: fail to added record at thesis set repo`,
        { attrs: newThesis }
      )
    }
    return success({ id: newThesis.id });

  }
}
