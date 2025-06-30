import type { DeleteModelImageCommand, DeleteModelImageMeta } from "#models/domain/struct/delete-image";
import type { RequestScope, DomainResult } from "rilata/api";
import { ModelUseCase } from "../../base-uc";
import { failure, success } from "rilata/core";
import { deleteModelImageValidator } from "./v-map";
import type { DeleteFileCommand } from "#files/domain/struct/delete-file";

export class DeleteModelImageUC extends ModelUseCase<DeleteModelImageMeta> {
  arName = 'ModelAr' as const;

  name = 'Delete Model Image Use Case' as const;

  inputName = 'delete-model-image' as const;

  protected supportAnonimousCall = true;

  protected validator = deleteModelImageValidator;

  async runDomain(
    input: DeleteModelImageCommand, requestData: RequestScope,
  ): Promise<DomainResult<DeleteModelImageMeta>> {
    const { id, imageId } = input.attrs;
    const ArResult = await this.getModelAr(id);
    if (ArResult.isFailure()) return failure(ArResult.value);
    const aRoot = ArResult.value;

    const modelPolicy = this.getModelPolicy(requestData.caller, aRoot.getAttrs());
    if (modelPolicy.canEdit() === false) {
      return failure({
        name: 'DeletingIsNotPermittedError',
        description: 'Вы не имеете прав на удаление этой модели',
        type: 'domain-error',
      });
    }
    
    aRoot.deleteImage(imageId);
    await this.getRepo().update(aRoot.getAttrs());

    const facade = this.moduleResolver.fileFacade;
    const command: DeleteFileCommand = {
      name: 'delete-file',
      attrs: { id: imageId },
      requestId: input.requestId,
    }
    await facade.deleteFile(command, requestData.caller)

    return success('success');
  }

}
