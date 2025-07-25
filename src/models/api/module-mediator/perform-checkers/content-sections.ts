import type { ModelArMeta } from "#models/domain/meta";
import type { CanPerformPayload } from "rilata/api-server";
import type { Caller, AnonymousUser } from "rilata/core";
import { ModelPolicy } from "#models/domain/policy";
import { PerformCheckerService } from "#app/api/perform-checker-service";
import type { ModelModuleResolvers } from "#models/api/types";
import type { ContentSectionArMeta } from "#user-contents/domain/section/meta";
import type { CyOwnerAggregateAttrs } from "#app/core/types";
import type { GetOwnerArContentSectionsCommand } from "#user-contents/domain/section/struct/get-owner-sections/contract";
import type { GetContentSectionCommand } from "#user-contents/domain/section/struct/get-section/contract";

const isNotMutableActions: [
  GetOwnerArContentSectionsCommand['name'],
  GetContentSectionCommand['name']
] = ['get-owner-ar-content-sections', 'get-content-section']

export class ContentSectionPerformCheckersService extends PerformCheckerService<
  ModelModuleResolvers
> {
  abstractArName: ContentSectionArMeta['name'] = 'ContentSectionAr';

  ownerArName: ModelArMeta['name'] = 'ModelAr';

  async hasPerform(
    payload: CanPerformPayload,
    caller: Exclude<Caller, AnonymousUser>,
  ): Promise<boolean> {
    const contentAttrs = payload.ownerAggregateAttrs as CyOwnerAggregateAttrs;
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
