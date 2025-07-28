import type { ApiMethods } from "telegraf/types";

export interface Bot {
  sendMessage(...rest: Parameters<ApiMethods<unknown>['sendMessage']>): void

  sendMessage(...rest: Parameters<ApiMethods<unknown>['getH']>): void
}
