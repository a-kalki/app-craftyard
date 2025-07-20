import type { Cost } from '#app/domain/types';
import { costUtils } from '#app/domain/utils/cost/cost-utils';
import type { ModelAttrs } from '#models/domain/struct/attrs';
import { WorkspaceRentOfferAR } from '#offer/domain/workspace-rent/a-root';
import type { WorkspaceRentOfferAttrs } from '#offer/domain/workspace-rent/struct/attrs';

export class HobbyKitOfferService {
  /**
   * Рассчитывает общие расходы на создание хобби-кит оффера.
   * Включает стоимость модели и стоимость абонемента со скидкой для мастера.
   */
  calculateTotalExpenses(
    modelCost: Cost,
    rentOffer: WorkspaceRentOfferAttrs
  ): Cost {
    const rentOfferAr = new WorkspaceRentOfferAR(rentOffer);
    return costUtils.sum(modelCost, rentOfferAr.getMasterRentCost());
  }

  /**
   * Рассчитывает чистую прибыль от хобби-кит оффера.
   * Продажная цена оффера минус общие расходы.
   */
  calculateNetProfit(
    offerSellingPrice: Cost,
    modelCost: Cost,
    rentOffer: WorkspaceRentOfferAttrs
  ): Cost {
    const totalExpenses = this.calculateTotalExpenses(modelCost, rentOffer);
    return costUtils.diff(offerSellingPrice, totalExpenses);
  }

  checkNetProfit(
    offerSellingPrice: Cost,
    modelAttrs: ModelAttrs,
    rentOffer: WorkspaceRentOfferAttrs
  ): string[] {
    const profit = this.calculateNetProfit(offerSellingPrice, modelAttrs.cost, rentOffer);
    if (profit.price <= 0) return ['Расходы перекрывают доход.'];
    return [];
  }
}

export const hobbyKitOfferService = new HobbyKitOfferService();
