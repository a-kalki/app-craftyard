import type { ModuleMeta, ModuleResolver } from "rilata/api";
import type { Logger } from "rilata/api-helper";
import type { ModuleMediator, ServerResolver } from "rilata/api-server";

export type CraftYardServerResolver = ServerResolver & {
  botLogger: Logger,
  appBotName: string,
  appBotToken: string,
  moduleMediator: ModuleMediator
}

export type CraftYardResolvers = {
  moduleResolver: ModuleResolver,
  serverResolver: CraftYardServerResolver,
}

export type CraftYartModuleMeta = Omit<ModuleMeta, 'resolvers'> & {
  resolvers: CraftYardResolvers
}
