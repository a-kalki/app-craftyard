import type { ChildableAttrs } from "#cooperation/domain/base/childable/struct/attrs";

/** Организует исполнение конкретного предложения, направляя прибыль Исполнителям
    после учёта комиссий вышестоящей организации.
*/
export type OfferCooperationAttrs = ChildableAttrs & {
  fatherId: string,
  editorIds: string[],
  type: 'OFFER_COOPERATION',
}
