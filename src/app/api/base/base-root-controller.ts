import type { BaseService } from "./service";
import type { Command } from "./types";

export abstract class BaseRootController {
  abstract rootEndpoint: string;

  abstract services: BaseService<Command>[];
}
