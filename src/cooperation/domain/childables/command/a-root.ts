import type { CommandCooperationArMeta } from "./meta";
import { ChildableAr } from "#cooperation/domain/base/childable/a-root";
import type { CommandCooperationAttrs } from "./struct/attrs";
import { commandCooperationValidator } from "./struct/v-map";
import type { Fatherble, OrganizationCooperation, OfferCooperation, Executable, Executor, CommandCooperation } from "#cooperation/domain/base/node/struct/interfaces";

export class CommandCooperationAr
  extends ChildableAr<CommandCooperationArMeta>
  implements Executable
{
  name = "CommandCooperationAr" as const;

  constructor(attrs: CommandCooperationAttrs) {
    super(attrs, commandCooperationValidator);
  }

  isFatherable(): this is Fatherble {
    return false;
  }

  isOrganization(): this is OrganizationCooperation {
    return false;
  }

  isOffer(): this is OfferCooperation {
    return false;
  }

  isCommand(): this is CommandCooperation {
    return true;
  }

  isExecutable(): this is Executable {
    return true;
  }

  isExecutor(): this is Executor {
    return false;
  }

  getProfit(): number {
    return this.attrs.profitePercentage;
  }
}
