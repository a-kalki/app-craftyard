import { CourseOfferAR } from "#offer/domain/course/a-root";
import { HobbyKitOfferAR } from "#offer/domain/hobby-kit/a-root";
import type { OfferAttrs } from "#offer/domain/offers";
import { ProductSaleOfferAR } from "#offer/domain/product-sale/a-root";
import { WorkspaceRentOfferAR } from "#offer/domain/workspace-rent/a-root";
import { AssertionException } from "rilata/core";
import type { GetOfferClass } from "./types";

class OfferFactory {
  create<C extends OfferAttrs>(attrs: C): GetOfferClass<C>
  {
    const { type } = attrs;
    if (type === 'CourseOffer') return new CourseOfferAR(attrs) as GetOfferClass<C>;
    else if (type === 'ProductSaleOffer') return new ProductSaleOfferAR(attrs) as GetOfferClass<C>;
    else if (type === 'WorkspaceRentOffer') return new WorkspaceRentOfferAR(attrs) as GetOfferClass<C>;
    else if (type === 'HobbyKitOffer') return new HobbyKitOfferAR(attrs) as GetOfferClass<C>;
    else throw new AssertionException(
      'not correct aggregate attrs: ' + JSON.stringify(attrs, null, 2),
    );
  }
}

export const offerFactory = new OfferFactory();
