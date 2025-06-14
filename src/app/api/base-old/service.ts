import type { AppUser, Result } from "../../domain/types";
import type { Command } from "./types";

export abstract class BaseService<C extends Command> {
  abstract commandName: C['command'];

  abstract execute(dto: Command, currUserId: string): Promise<Result<unknown, unknown>>
}
