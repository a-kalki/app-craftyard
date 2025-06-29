import type { CanPerformPayload } from "rilata/api-server";
import type { Caller } from "rilata/core";
import type { CraftYardResolvers } from "./resolvers";

export abstract class PerformCheckerService<R extends CraftYardResolvers> {
  abstract abstractArName: string;

  abstract ownerArName: string;

  protected moduleResolver!: R['moduleResolver'];

  protected serverResolver!: R['serverResolver'];


  init(resolvers: R) {
    this.moduleResolver = resolvers.moduleResolver;
    this.serverResolver = resolvers.serverResolver;
  }

  abstract hasPerform(
    payload: CanPerformPayload,
    caller: Caller
  ): Promise<boolean> 
} 
