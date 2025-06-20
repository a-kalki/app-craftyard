import type { AddModelImagesCommand, AddModelImagesMeta } from "#models/domain/struct/add-images";
import type { RequestScope, RunDomainResult } from "rilata/api";
import { ModelUseCase } from "../../base-use-case";
import { failure, success } from "rilata/core";
import { addModelImagesValidator } from "./v-map";

export class AddModelImagesUC extends ModelUseCase<AddModelImagesMeta> {
  arName = 'ModelAr' as const;

  name = 'Add Model Images Use Case' as const;

  inputName = 'add-model-images' as const;

  protected supportAnonimousCall = true;

  protected validator = addModelImagesValidator;

  async runDomain(
    input: AddModelImagesCommand, requestData: RequestScope,
  ): Promise<RunDomainResult<AddModelImagesMeta>> {
    const { id, pushImageIds } = input.attrs;
    const result = await this.getModelAr(id);
    if (result.isFailure()) return failure(result.value);
    const aRoot = result.value;

    const modelPolicy = this.getModelPolicy(requestData.caller);
    if (modelPolicy.canEdit(aRoot.getAttrs()) === false) {
      return failure({
        name: 'EditingIsNotPermitted',
        description: 'Вы не имеете прав на редактирование этой модели',
        type: 'domain-error',
      });
    }
    
    aRoot.addImages(pushImageIds);
    await this.getRepo().update(aRoot.getAttrs());
    return success('success');
  }

}
