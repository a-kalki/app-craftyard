import { ChildableAr } from "#cooperation/domain/base/childable/a-root";
import type { OfferCooperationArMeta } from "./meta";
import type { OfferCooperationAttrs } from "./struct/attrs";
import { offerCooperationContributionValidator } from "./struct/v-map";
import type { CommandCooperation, Executable, Executor, Fatherble, OfferCooperation, OrganizationCooperation } from "#cooperation/domain/base/node/struct/interfaces";

export class OfferCooperationAr
  extends ChildableAr<OfferCooperationArMeta>
  implements OfferCooperation
{
  name = "OfferCooperationAr" as const;

  constructor(attrs: OfferCooperationAttrs) {
    super(attrs, offerCooperationContributionValidator);
  }

  isFatherable(): this is Fatherble {
    return true;
  }

  isOrganization(): this is OrganizationCooperation {
    return false;
  }

  isOffer(): this is OfferCooperation {
    return true;
  }

  isCommand(): this is CommandCooperation {
    return false;
  }

  isExecutable(): this is Executable {
    return false;
  }

  isExecutor(): this is Executor {
    return false;
  }

  getFatherId(): string | undefined {
    return this.attrs.fatherId;
  }
}
