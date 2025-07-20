import { currency } from "#app/domain/constants";
import type { Cost, Currency } from "#app/domain/types";
import { AssertionException } from "rilata/core";

class CostUtils {
  toString(cost: Cost): string {
    return `${cost.price} ${currency[cost.currency]}`;
  }

  create(price: number, currency: keyof Currency): Cost {
    return { price, currency };
  }

  /** Возвращает сумму a и b */
  sum(a: Cost, b: Cost): Cost {
    this.checkCurrencies(a, b);
    return { price: a.price + b.price, currency: a.currency };
  }

  /** Возвращает разницу между a и b */
  diff(a: Cost, b: Cost): Cost {
    this.checkCurrencies(a, b);
    return { price: a.price - b.price, currency: a.currency };
  }

  /** Возвращает результат деления */
  div(a: Cost, divider: number): Cost {
    return { price: a.price / divider, currency: a.currency };
  }

  /** Возвращает результат умножения */
  multiplication(a: Cost, divider: number): Cost {
    return { price: a.price * divider, currency: a.currency };
  }

  /** Возвращает процент от текущего значения. */
  percent(a: Cost, persent: number): Cost {
    return { price: a.price * persent, currency: a.currency };
  }

  /** Равны ли значения. Если валюта разная, всегда false. */
  equal(a: Cost, b: Cost): boolean {
    return a.currency === b.currency && a.price === b.price;
  }

  /** Не равны ли значения. Если валюта разная, всегда false. */
  notEqual(a: Cost, b: Cost): boolean {
    return !this.equal(a, b);
  }

  /** a больше b. Если валюта разная, всегда false. */
  more(a: Cost, b: Cost): boolean {
    return a.currency === b.currency && a.price > b.price;
  }

  /** a меньше b. Если валюта разная, всегда false. */
  less(a: Cost, b: Cost): boolean {
    return a.currency === b.currency && a.price < b.price;
  }

  /** a больше или равно b. Если валюта разная, всегда false. */
  moreOrEqual(a: Cost, b: Cost): boolean {
    return this.more(a, b) || this.equal(a, b);
  }

  /** a меньше или равно b. Если валюта разная, всегда false. */
  lessOrEqual(a: Cost, b: Cost): boolean {
    return this.less(a, b) || this.equal(a, b);
  }

  private checkCurrencies(a: Cost, b: Cost): void {
    if (a.currency !== b.currency) {
      throw new AssertionException(`not equal currency: a=${a.currency}; b=${b.currency}.`);
    }
  }
}

export const costUtils = new CostUtils();
