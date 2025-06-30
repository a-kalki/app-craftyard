import type { GetContentPayload } from "rilata/api-server";
import type { Caller, NotContentToDeliveryError, Result } from "rilata/core";
import type { CraftYardResolvers } from "./resolvers";

export abstract class ContentDelivererService<R extends CraftYardResolvers> {
  abstract abstractArName: string;

  abstract ownerArName: string;

  protected moduleResolver!: R['moduleResolver'];

  protected serverResolver!: R['serverResolver'];


  init(resolvers: R) {
    this.moduleResolver = resolvers.moduleResolver;
    this.serverResolver = resolvers.serverResolver;
  }

  abstract getContent(
    payload: GetContentPayload,
    caller: Caller
  ): Promise<Result<NotContentToDeliveryError, unknown>>
} 
