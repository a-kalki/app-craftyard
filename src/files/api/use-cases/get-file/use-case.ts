import type { RequestScope, DomainResult } from "rilata/api";
import { FileUseCase } from "../../base-uc";
import { getFileValidator } from "./v-map";
import { failure, success } from "rilata/core";
import type { GetFileCommand, GetFileUcMeta } from "#app/domain/file/struct/get-file";

export class GetFileUC extends FileUseCase<GetFileUcMeta> {
  arName = "FileEntryAr" as const;

  name = "Get File Use Case" as const;

  inputName = "get-file" as const;

  protected supportAnonimousCall = false;

  protected validator = getFileValidator;

  async runDomain(
    input: GetFileCommand, requestData: RequestScope,
  ): Promise<DomainResult<GetFileUcMeta>> {
    const { id } = input.attrs;
    const attrsResult = await this.getFileAttrs(id);
    if (attrsResult.isFailure()) {
      return failure(attrsResult.value);
    }
    const attrs = attrsResult.value;

    if (!this.getFilePolicy(requestData.caller).canGetFile(attrs)) {
      return failure({
        name: 'GettingFileIsNotPermittedError',
        description: 'У вас нет прав на просмотр этого файла',
        type: 'domain-error',
      });
    }
    return success(attrs);
  }
}
