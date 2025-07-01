import { QueryUseCase, type RequestScope } from "rilata/api";
import { failure, success, type AbstractAggregateAttrs, type Result, type UCMeta } from "rilata/core";
import type { UserContentModuleResolvers } from "./types";
import type { AggregateDoesNotExistError } from "#app/domain/errors";
import type { ContentSectionRepo } from "#user-contents/domain/section/repo";
import type { ContentSectionAttrs } from "#user-contents/domain/section/struct/attrs";
import { ContentSectionAr } from "#user-contents/domain/section/a-root";
import type { CanPerformPayload } from "rilata/api-server";
import type { UserContentRepo } from "#user-contents/domain/content/repo";

export abstract class UserContentUseCase<META extends UCMeta> extends QueryUseCase<
  UserContentModuleResolvers, META
> {
  protected transactionStrategy!: never;

  getContentSectionRepo(): ContentSectionRepo {
    return this.moduleResolver.contentSectionRepo;
  }

  getUserContentRepo(): UserContentRepo {
    return this.moduleResolver.userContentRepo
  }

  async getContentSectionAttrs(id: string): Promise<Result<AggregateDoesNotExistError, ContentSectionAttrs>> {
    const thesisSetAttrs = await this.moduleResolver.contentSectionRepo.findContentSection(id);
    if (!thesisSetAttrs) {
      return failure({
        name: 'AggregateDoesNotExistError',
        description: 'Агрегата с таким id не существует.',
        type: 'domain-error',
      });
    }
    return success(thesisSetAttrs);
  }

  async getFileAr(id: string): Promise<Result<AggregateDoesNotExistError, ContentSectionAr>> {
    const res = await this.getContentSectionAttrs(id);
    if (res.isFailure()) return failure(res.value);
    return success(new ContentSectionAr(res.value));
  }

  async canAction(aggrData: AbstractAggregateAttrs, reqData: RequestScope): Promise<boolean> {
    if (aggrData.access === 'public') return true;

    const caller = this.getUserCaller(reqData);
    const payload: CanPerformPayload = {
      ownerAggregateAttrs: aggrData,
      action: this.inputName,
    }
    const moduleMediator = this.serverResolver.moduleMediator;
    return moduleMediator.canPerform(this.arName, payload, caller);
  }
}
