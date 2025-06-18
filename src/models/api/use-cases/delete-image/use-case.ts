import type { DeleteModelImageCommand, DeleteModelImageMeta } from "#models/domain/struct/delete-image";
import type { RequestScope, RunDomainResult } from "rilata/api";
import { ModelUseCase } from "../../base-use-case";
import { failure, success } from "rilata/core";
import { deleteModelImageValidator } from "./v-map";

export class DeleteModelImageUC extends ModelUseCase<DeleteModelImageMeta> {
  arName = 'ModelAr' as const;

  name = 'Delete Model Image Use Case' as const;

  inputName = 'delete-model-image' as const;

  protected supportAnonimousCall = true;

  protected validator = deleteModelImageValidator;

  async runDomain(
    input: DeleteModelImageCommand, requestData: RequestScope,
  ): Promise<RunDomainResult<DeleteModelImageMeta>> {
    const { id, imageId } = input.attrs;
    const ArResult = await this.getModelAr(id);
    if (ArResult.isFailure()) return failure(ArResult.value);
    const aRoot = ArResult.value;

    const modelPolicy = this.getModelPolicy(requestData.caller);
    if (modelPolicy.canEdit(aRoot.getAttrs()) === false) {
      return failure({
        name: 'EditingIsNotPermitted',
        description: 'Вы не имеете прав на редактирование этой модели',
        type: 'domain-error',
      });
    }
    
    aRoot.deleteImage(imageId);
    await this.getRepo().update(aRoot.getAttrs());
    return success('success');
  }

}
