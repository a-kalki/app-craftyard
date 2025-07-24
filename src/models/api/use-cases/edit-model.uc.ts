import type { EditModelCommand, EditModelMeta } from "#models/domain/struct/edit-model/contract";
import type { RequestScope, DomainResult } from "rilata/api";
import { ModelUseCase } from "../base-uc";
import { failure, success } from "rilata/core";
import { ModelAr } from "#models/domain/a-root";
import { editModelValidator } from "#models/domain/struct/edit-model/v-map";

export class EditModelUC extends ModelUseCase<EditModelMeta> {
  arName = "ModelAr" as const;

  name = "Edit Model Use Case" as const;

  inputName = "edit-model" as const;

  protected supportAnonimousCall = false;

  protected validator = editModelValidator;

  async runDomain(input: EditModelCommand, requestData: RequestScope): Promise<DomainResult<EditModelMeta>> {
    const modelAttrs = await this.moduleResolver.modelRepo.findModel(input.attrs.id);
    if (!modelAttrs) {
      return failure({
        name: 'AggregateDoesNotExistError',
        description: 'Модель с таким id не найдена.',
        type: 'domain-error',
      });
    }
    const policy = this.getModelPolicy(requestData.caller, modelAttrs);
    if (!policy.canEdit()) {
      return failure({
        name: 'EditingIsNotPermittedError',
        description: 'У вас нет разрешения на редактирование модели.',
        type: 'domain-error',
      });
    }
    const modelAr = new ModelAr(modelAttrs);
    modelAr.editModel(input.attrs);
    const saveResult = await this.getRepo().update(modelAr.getAttrs());
    if (saveResult.changes === 0) {
      throw this.logger.error(
        `[${this.constructor.name}]: db not update model.`,
        { attrs: modelAr.getAttrs(), patch: input.attrs }
      );
    }
    return success('success');
  }

}
