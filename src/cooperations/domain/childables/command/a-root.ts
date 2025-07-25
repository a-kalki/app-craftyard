import type { CommandCooperationArMeta } from "./meta";
import { ChildableAr } from "#cooperations/domain/base/childable/a-root";
import type { CommandCooperationAttrs } from "./struct/attrs";
import { commandCooperationValidator } from "./struct/v-map";
import type {
  Fatherble, OrganizationCooperation, OfferCooperation, Executable, Executor, CommandCooperation,
} from "#cooperations/domain/base/interfaces/api";
import type { Cost } from "#app/core/types";
import type { StructureContext } from "#cooperations/domain/base/interfaces/node";

export class CommandCooperationAr
  extends ChildableAr<CommandCooperationArMeta>
  implements Executable
{
  name = "CommandCooperationAr" as const;

  constructor(attrs: CommandCooperationAttrs) {
    super(attrs, commandCooperationValidator);
  }

  info(): string {
    return `${this.getType()}: comission: ${Math.round(this.attrs.profitPercentage * 100)}%`
  }

  distributeProfit(amount: Cost, context: StructureContext): void {
    context.recordDistributionResult(this.getId(), amount);

    this.distributeProfitToChilds(amount, context);
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

  getProfitProcentage(): number {
    return this.attrs.profitPercentage;
  }
}
