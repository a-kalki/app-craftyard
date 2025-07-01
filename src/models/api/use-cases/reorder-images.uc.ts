import type { ReorderModelImagesCommand, ReorderModelImagesMeta } from "#models/domain/struct/reorder-images/contract";
import type { RequestScope, DomainResult } from "rilata/api";
import { ModelUseCase } from "../base-uc";
import { failure, success } from "rilata/core";
import { reorderModelImagesValidator } from "#models/domain/struct/reorder-images/v-map";

export class ReoderModelImagesUC extends ModelUseCase<ReorderModelImagesMeta> {
  arName = 'ModelAr' as const;

  name = 'Reorder Model Images Use Case' as const;

  inputName = 'reorder-model-images' as const;

  protected supportAnonimousCall = true;

  protected validator = reorderModelImagesValidator;

  async runDomain(
    input: ReorderModelImagesCommand, requestData: RequestScope,
  ): Promise<DomainResult<ReorderModelImagesMeta>> {
    const { id, reorderedImageIds } = input.attrs;
    const result = await this.getModelAr(id);
    if (result.isFailure()) return failure(result.value);
    const aRoot = result.value;

    const modelPolicy = this.getModelPolicy(requestData.caller, aRoot.getAttrs());
    if (modelPolicy.notCanEdit()) {
      return failure({
        name: 'EditingIsNotPermittedError',
        description: 'Вы не имеете прав на редактирование этой модели',
        type: 'domain-error',
      });
    }
    
    aRoot.reorderImages(reorderedImageIds);
    await this.getRepo().update(aRoot.getAttrs());
    return success('success');
  }

}
