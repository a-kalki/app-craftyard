import type { ChildableAttrs } from "#cooperations/domain/base/childable/struct/attrs";

/** Контейнер команды выполняющий конечную работу.
    Распределяет обязанности и выручку между детьми.
*/
export type CommandCooperationAttrs = ChildableAttrs & {
  profitPercentage: number,
  type: 'COMMAND_COOPERATION',
};
