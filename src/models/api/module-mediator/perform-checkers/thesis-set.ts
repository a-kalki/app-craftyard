import type { ModelArMeta } from "#models/domain/meta";
import type { CanPerformPayload } from "rilata/api-server";
import type { Caller, AnonymousUser } from "rilata/core";
import { ModelPolicy } from "#models/domain/policy";
import type { ThesisSetArMeta } from "#user-contents/domain/thesis-set/meta";
import type { GetOwnerArThesisSetsCommand } from "#user-contents/domain/thesis-set/struct/thesis-set/get-owner-ar-sets";
import type { GetThesisSetCommand } from "#user-contents/domain/thesis-set/struct/thesis-set/get";
import { PerformCheckerService } from "#app/api/perform-checker-service";
import type { ModelModuleResolvers } from "#models/api/types";

const isNotMutableActions: [
  GetOwnerArThesisSetsCommand['name'],
  GetThesisSetCommand['name']
] = ['get-owner-ar-thesis-sets', 'get-thesis-set']

export class ThesisSetPerformCheckersService extends PerformCheckerService<
  ModelModuleResolvers
> {
  abstractArName: ThesisSetArMeta['name'] = 'ThesisSetAr';

  ownerArName: ModelArMeta['name'] = 'ModelAr';

  async hasPerform(
    payload: CanPerformPayload,
    caller: Exclude<Caller, AnonymousUser>,
  ): Promise<boolean> {
    const contentAttrs = payload.ownerAggregateAttrs;
    const isNotMutableAction = (isNotMutableActions as string[]).includes(payload.action);
    if (isNotMutableAction && contentAttrs.access === 'public') return true;

    const repo = this.moduleResolver.modelRepo;
    const modelAttrs = await repo.findModel(contentAttrs.ownerId);
    if (!modelAttrs) {
      const logger = this.serverResolver.logger;
      logger.error(
        `[${this.constructor.name}] Not found model attrs by id: ${contentAttrs.ownerId}`,
        { contentAttrs }
      )
      return false;
    }
    const modelPolicy = new ModelPolicy(caller, modelAttrs);

    if (isNotMutableActions) return modelPolicy.canGetUserContent(contentAttrs);
    return modelPolicy.canEditUserContent(contentAttrs);
  }

}
