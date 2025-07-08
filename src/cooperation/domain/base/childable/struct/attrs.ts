import type { CooperationNodeAttrs } from "../../node/struct/attrs";

/** Абстрактный контейнер организатор.
  Через своих детей показывает как организована определенная работа.
  Кто участвует, обязанности, доли.
*/
export type ChildableAttrs = CooperationNodeAttrs & {
  childrenIds: string[],
}
