import { AssertionException } from "rilata/core";
import { CommandCooperationAr } from "./childables/command/a-root";
import { OfferCooperationAr } from "./childables/offer/a-root";
import { OrganizationCooperationAr } from "./childables/organization/a-root";
import { ExecutorAr } from "./executor/a-root";
import type { CooperationAr, CooperationDbo } from "./types";
import type { ExecutorAttrs } from "./executor/struct/attrs";
import type { CommandCooperationAttrs } from "./childables/command/struct/attrs";
import type { OfferCooperationAttrs } from "./childables/offer/struct/attrs";
import type { OrganizationCooperationAttrs } from "./childables/organization/struct/attrs";

export class CooperationFactory {
  restore<AR extends CooperationAr>(dbo: CooperationDbo): AR {
    const attrs = dbo as unknown;
    switch (dbo.type) {
      case 'EXECUTOR': 
        return new ExecutorAr(attrs as ExecutorAttrs) as AR;
      case 'COMMAND_COOPERATION':
        return new CommandCooperationAr(attrs as CommandCooperationAttrs) as AR;
      case 'OFFER_COOPERATION':
        return new OfferCooperationAr(attrs as OfferCooperationAttrs) as AR;
      case 'ORGANIZATION_COOPERATION':
        return new OrganizationCooperationAr(attrs as OrganizationCooperationAttrs) as AR;
      default:
        throw new AssertionException(
          'not correct aggregate type: ' + JSON.stringify(attrs, null, 2),
        );
    }
  }

  batchRestore(dbos: CooperationDbo[]): CooperationAr[] {
    return dbos.map(dbo => this.restore(dbo));
  }
}

export const cooperationFactory = new CooperationFactory();
