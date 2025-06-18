import { QueryUseCase } from "rilata/api";
import { AssertionException, failure, success, type Caller, type Result, type UCMeta } from "rilata/core";
import type { FileNotFoundError } from "../domain/struct/get-file";
import type { FilesModuleResolvers } from "./types";
import { FilePolicy } from "../domain/policy";
import { FileAr } from "../domain/a-root";
import type { FileEntryAttrs } from "../domain/struct/attrs";
import type { FileRepo } from "../domain/repo";

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
