import type { GetOfferCommand, GetOfferMeta } from "#offer/domain/crud/get-offer/contract";
import type { ApiOfferFacade } from "#offer/domain/facade";
import type { Caller, BackendResultByMeta } from "rilata/core";
import type { OfferModule } from "./module";

export class OfferBackendFacade implements ApiOfferFacade {
  constructor(protected offerModule: OfferModule) {}

  async getOffer(id: string, caller: Caller, requestId: string): Promise<BackendResultByMeta<GetOfferMeta>> {
    const command: GetOfferCommand = {
      name: "get-offer",
      attrs: { id },
      requestId
    }
    return this.offerModule.handleRequest(command, { caller }) as unknown as BackendResultByMeta<GetOfferMeta>
  }
}
