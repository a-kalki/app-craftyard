import type { Logger } from "rilata/api-helper";
import type { ServerResolver } from "rilata/api-server";

export type DedokServerResolver = ServerResolver & {
  botLogger: Logger,
  appBotName: string,
  appBotToken: string,
}
