import { currency } from "#app/domain/constants";
import type { Cost } from "#app/domain/types";

class CostUtils {
  costToString(cost: Cost): string {
    return `${cost.price} ${currency[cost.currency]}`;
  }
}

export const costUtils = new CostUtils();
