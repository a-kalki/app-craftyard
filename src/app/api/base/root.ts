import type { BaseService } from "./service";
import type { Command } from "./types";

export abstract class BaseRoot {
  abstract rootName: string;

  abstract services: BaseService<Command>[];
}
