import type { RequestScope, DomainResult } from "rilata/api";
import { FileUseCase } from "../base-uc";
import { failure, success } from "rilata/core";
import type { GetFileCommand, GetFileUcMeta } from "#files/domain/struct/get-file/contract";
import { getFileValidator } from "#files/domain/struct/get-file/v-map";

export class GetFileUC extends FileUseCase<GetFileUcMeta> {
  arName = "FileEntryAr" as const;

  name = "Get File Use Case" as const;

  inputName = "get-file" as const;

  protected supportAnonimousCall = true;

  protected validator = getFileValidator;

  async runDomain(
    input: GetFileCommand, reqScope: RequestScope,
  ): Promise<DomainResult<GetFileUcMeta>> {
    const { id } = input.attrs;
    const attrsResult = await this.getFileAttrs(id);
    if (attrsResult.isFailure()) {
      return failure(attrsResult.value);
    }
    const attrs = attrsResult.value;
    const canPerform = this.canPerform(attrs, reqScope);

    if (!canPerform) {
      return failure({
        name: 'GettingIsNotPermittedError',
        description: 'У вас нет прав на просмотр этого файла',
        type: 'domain-error',
      });
    }
    return success(attrs);
  }
}
