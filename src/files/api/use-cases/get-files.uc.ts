import type { RequestScope, DomainResult } from "rilata/api";
import { FileUseCase } from "../base-uc";
import { success } from "rilata/core";
import type { GetFilesCommand, GetFilesUcMeta } from "#files/domain/struct/get-files/contract";
import { getFilesValidator } from "#files/domain/struct/get-files/v-map";

export class GetFilesUC extends FileUseCase<GetFilesUcMeta> {
  arName = "FileEntryAr" as const;

  name = "Get Files Use Case" as const;

  inputName = "get-files" as const;

  protected supportAnonimousCall = true;

  protected validator = getFilesValidator;

  async runDomain(
    input: GetFilesCommand, reqScope: RequestScope,
  ): Promise<DomainResult<GetFilesUcMeta>> {
    const getPromises = input.attrs.ids.map(id => this.getFileAttrs(id));
    const getResults = await Promise.all(getPromises);
    const fileAttrsArray = getResults
      .filter(result => result.isSuccess())
      .map(result => result.value);

    const perfomPromises = fileAttrsArray.map(attrs => this.canPerform(attrs, reqScope));
    const performs = await Promise.all(perfomPromises);

    return success(fileAttrsArray.filter((_, i) => performs[i]));
  }
}
