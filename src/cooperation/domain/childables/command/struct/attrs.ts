import type { ChildableAttrs } from "#cooperation/domain/base/childable/struct/attrs";

/** Контейнер команды выполняющий конечную работу.
    Распределяет обязанности и выручку между детьми.
*/
export type CommandCooperationAttrs = ChildableAttrs & {
  profitePercentage: number,
  type: 'COMMAND_COOPERATION',
};
