import type { Command } from "./types";

export abstract class BaseService<C extends Command> {
  abstract commandName: C['command'];

  abstract execute(dto: Command): Promise<unknown>
}
