import type { AddModelCommand, AddModelMeta } from "#models/domain/struct/add-model/contract";
import type { RequestScope, DomainResult } from "rilata/api";
import { ModelUseCase } from "../base-uc";
import { failure, success } from "rilata/core";
import { ModelAr } from "#models/domain/a-root";
import { addModelValidator } from "#models/domain/struct/add-model/v-map";
import { callerUtils } from "rilata/utils";
import type { ModelAttrs } from "#models/domain/struct/attrs";
import { uuidUtility } from "rilata/api-helper";
import { ContributionPolicy } from "#users/domain/user-contributions/policy";

export class AddModelUC extends ModelUseCase<AddModelMeta> {
  arName = "ModelAr" as const;

  name = "Add Model Use Case" as const;

  inputName = "add-model" as const;

  protected supportAnonimousCall = false;

  protected validator = addModelValidator;

  async runDomain(input: AddModelCommand, requestData: RequestScope): Promise<DomainResult<AddModelMeta>> {
    const checkedCaller = callerUtils.userCaller(requestData.caller);
    const userResult = await this.moduleResolver.userFacade.getUser(
      checkedCaller.id, checkedCaller, input.requestId,
    );
    if (userResult.isFailure()) {
      return failure({
        name: 'AddingIsNotPermittedError',
        description: 'При запросе пользователя пришел неожиданный ответ',
        type: 'domain-error',
      });
    }
    const policy = new ContributionPolicy(userResult.value);
    if (!policy.canAddModel()) {
      return failure({
        name: 'AddingIsNotPermittedError',
        description: 'У вас нет разрешения на добавление модели.',
        type: 'domain-error',
      });
    }
    const modelAttrs: ModelAttrs = {
      id: uuidUtility.getNewUuidV7(),
      ownerId: checkedCaller.id,
      ...input.attrs,
      imageIds: [],
      createAt: Date.now(),
      updateAt: Date.now(),
    }
    const modelAr = new ModelAr(modelAttrs);
    const saveResult = await this.getRepo().add(modelAr.getAttrs());
    if (saveResult.changes === 0) {
      throw this.logger.error(
        `[${this.constructor.name}]: db not added model.`,
        { attrs: modelAr.getAttrs(), patch: input.attrs }
      );
    }
    return success({ modelId: modelAttrs.id });
  }

}
