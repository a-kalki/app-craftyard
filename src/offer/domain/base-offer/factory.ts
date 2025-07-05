import { CourseOfferAR } from "#offer/domain/course/a-root";
import type { CourseOfferAttrs } from "#offer/domain/course/struct/attrs";
import { HobbyKitOfferAR } from "#offer/domain/hobby-kit/a-root";
import type { HobbyKitOfferAttrs } from "#offer/domain/hobby-kit/struct/attrs";
import type { OfferAttrs } from "#offer/domain/offers";
import { ProductSaleOfferAR } from "#offer/domain/product-sale/a-root";
import type { ProductSaleOfferAttrs } from "#offer/domain/product-sale/struct/attrs";
import { WorkspaceRentOfferAR } from "#offer/domain/workspace-rent/a-root";
import type { WorkspaceRentOfferAttrs } from "#offer/domain/workspace-rent/struct/attrs";
import { AssertionException } from "rilata/core";

export class OfferFactory {
  create(attrs: CourseOfferAttrs): CourseOfferAR;
  create(attrs: HobbyKitOfferAttrs): HobbyKitOfferAR;
  create(attrs: WorkspaceRentOfferAttrs): WorkspaceRentOfferAR;
  create(attrs: ProductSaleOfferAttrs): ProductSaleOfferAR;
  create(attrs: OfferAttrs): 
    CourseOfferAR | HobbyKitOfferAR | WorkspaceRentOfferAR | ProductSaleOfferAR
  {
    const { type } = attrs;
    if (type === 'CourseOffer') return new CourseOfferAR(attrs);
    else if (type === 'ProductSaleOffer') return new ProductSaleOfferAR(attrs);
    else if (type === 'WorkspaceRentOffer') return new WorkspaceRentOfferAR(attrs);
    else if (type === 'HobbyKitOffer') return new HobbyKitOfferAR(attrs);
    else throw new AssertionException(
      'not correct aggregate attrs: ' + JSON.stringify(attrs, null, 2),
    );
  }
}
