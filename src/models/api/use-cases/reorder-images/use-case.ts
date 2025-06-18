import type { ReorderModelImagesCommand, ReorderModelImagesMeta } from "#models/domain/struct/reorder-images";
import type { RequestScope, RunDomainResult } from "rilata/api";
import { ModelUseCase } from "../../base-use-case";
import { failure, success } from "rilata/core";
import { reorderModelImagesValidator } from "./v-map";

export class ReoderModelImagesUC extends ModelUseCase<ReorderModelImagesMeta> {
  arName = 'ModelAr' as const;

  name = 'Reorder Model Images Use Case' as const;

  inputName = 'reorder-model-images' as const;

  protected supportAnonimousCall = true;

  protected validator = reorderModelImagesValidator;

  async runDomain(
    input: ReorderModelImagesCommand, requestData: RequestScope,
  ): Promise<RunDomainResult<ReorderModelImagesMeta>> {
    const { id, reorderedImageIds } = input.attrs;
    const result = await this.getModelAr(id);
    if (result.isFailure()) return failure(result.value);
    const aRoot = result.value;

    const modelPolicy = this.getModelPolicy(requestData.caller);
    if (modelPolicy.notCanEdit(aRoot.getAttrs())) {
      return failure({
        name: 'EditingIsNotPermitted',
        description: 'Вы не имеете прав на редактирование этой модели',
        type: 'domain-error',
      });
    }
    
    aRoot.reorderImages(reorderedImageIds);
    await this.getRepo().update(aRoot.getAttrs());
    return success('success');
  }

}
