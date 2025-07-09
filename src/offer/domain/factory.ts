import { CourseOfferAR } from "#offer/domain/course/a-root";
import { HobbyKitOfferAR } from "#offer/domain/hobby-kit/a-root";
import { ProductSaleOfferAR } from "#offer/domain/product-sale/a-root";
import { WorkspaceRentOfferAR } from "#offer/domain/workspace-rent/a-root";
import { AssertionException } from "rilata/core";
import type { OfferAr, OfferDbo } from "./types";
import type { CourseOfferAttrs } from "./course/struct/attrs";
import type { HobbyKitOfferAttrs } from "./hobby-kit/struct/attrs";
import type { ProductSaleOfferAttrs } from "./product-sale/struct/attrs";
import type { WorkspaceRentOfferAttrs } from "./workspace-rent/struct/attrs";

class OfferFactory {
  restore<AR extends OfferAr>(dbo: OfferDbo): AR {
    const attrs = dbo as unknown;
    switch (dbo.type){
      case 'COURSE_OFFER':
        return new CourseOfferAR(attrs as CourseOfferAttrs) as AR;
      case 'HOBBY_KIT_OFFER':
        return new HobbyKitOfferAR(attrs as HobbyKitOfferAttrs) as AR;
      case 'PRODUCT_SALE_OFFER':
        return new ProductSaleOfferAR(attrs as ProductSaleOfferAttrs) as AR;
      case 'WORKSPACE_RENT_OFFER':
        return new WorkspaceRentOfferAR(attrs as WorkspaceRentOfferAttrs) as AR;
      default:
        throw new AssertionException(
          'not correct aggregate type: ' + JSON.stringify(attrs, null, 2),
        );
    }
  }
}

export const offerFactory = new OfferFactory();
