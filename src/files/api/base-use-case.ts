import { QueryUseCase } from "rilata/api";
import { AssertionException, failure, success, type Caller, type Result, type UCMeta } from "rilata/core";
import type { FilesModuleResolvers } from "./types";
import { FilePolicy } from "#app/domain/file/policy";
import type { FileRepo } from "#app/domain/file/repo";
import type { FileNotFoundError } from "#app/domain/file/struct/get-file";
import type { FileEntryAttrs } from "#app/domain/file/struct/attrs";
import { FileAr } from "#app/domain/file/a-root";

export abstract class FileUseCase<META extends UCMeta> extends QueryUseCase<
  FilesModuleResolvers, META
> {
  protected transactionStrategy!: never;

  getFilePolicy(caller: Caller): FilePolicy {
    if (caller.type === 'AnonymousUser') {
      throw new AssertionException('Not be called by anonimous user');
    }
    return new FilePolicy(caller);
  }

  getRepo(): FileRepo {
    return this.moduleResolver.db;
  }

  async getFileAttrs(id: string): Promise<Result<FileNotFoundError, FileEntryAttrs>> {
    const fileAttrs = await this.moduleResolver.db.findFile(id);
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
