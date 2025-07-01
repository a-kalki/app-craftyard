import type { ModelArMeta } from "#models/domain/meta";
import type { CanPerformPayload } from "rilata/api-server";
import type { Caller, AnonymousUser } from "rilata/core";
import { ModelPolicy } from "#models/domain/policy";
import { PerformCheckerService } from "#app/api/perform-checker-service";
import type { ModelModuleResolvers } from "#models/api/types";
import type { GetFileCommand } from "#files/domain/struct/get-file/contract";
import type { CyOwnerAggregateAttrs } from "#app/domain/types";
import type { FileEntryArMeta } from "#files/domain/meta";

const isNotMutableActions: [
  GetFileCommand['name'],
] = ['get-file']

export class FilesPerformCheckersService extends PerformCheckerService<
  ModelModuleResolvers
> {
  abstractArName: FileEntryArMeta['name'] = 'FileEntryAr';

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

    if (isNotMutableActions) return modelPolicy.canGetFile(contentAttrs);
    return modelPolicy.canEditFile(contentAttrs);
  }

}
