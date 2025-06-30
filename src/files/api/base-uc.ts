import { QueryUseCase, type RequestScope } from "rilata/api";
import { failure, success, type AbstractAggregateAttrs, type Result, type UCMeta } from "rilata/core";
import type { FilesModuleResolvers } from "./types";
import type { CanPerformPayload } from "rilata/api-server";
import type { FileRepo } from "#files/domain/repo";
import type { FileEntryArMeta } from "#files/domain/meta";
import type { FileNotFoundError } from "#files/domain/struct/get-file";
import type { FileEntryAttrs } from "#files/domain/struct/attrs";
import { FileAr } from "#files/domain/a-root";

export abstract class FileUseCase<META extends UCMeta> extends QueryUseCase<
  FilesModuleResolvers, META
> {
  protected transactionStrategy!: never;

  getRepo(): FileRepo {
    return this.moduleResolver.fileRepo;
  }

  protected async canPerform(fileAttrs: AbstractAggregateAttrs, reqScope: RequestScope): Promise<boolean> {
    if (fileAttrs.access === 'public') return true;
    const arName: FileEntryArMeta['name'] = 'FileEntryAr';
    const payload: CanPerformPayload = {
      ownerAggregateAttrs: fileAttrs,
      action: this.inputName,
    }
    return this.serverResolver.moduleMediator.canPerform(arName, payload, reqScope.caller);
  }

  async getFileAttrs(id: string): Promise<Result<FileNotFoundError, FileEntryAttrs>> {
    const fileAttrs = await this.moduleResolver.fileRepo.findFile(id);
    if (!fileAttrs) {
      return failure({
        name: 'FileNotFoundError',
        description: 'Такого файла в БД не существует',
        type: 'domain-error',
      });
    }
    return success(fileAttrs);
  }

  async getFileAr(id: string): Promise<Result<FileNotFoundError, FileAr>> {
    const res = await this.getFileAttrs(id);
    if (res.isFailure()) return failure(res.value);
    return success(new FileAr(res.value));
  }
}
