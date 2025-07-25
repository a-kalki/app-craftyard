import type { CooperationNodeAttrs } from "#cooperations/domain/base/node/struct/attrs";

/** Конечный исполнитель и получатель денег. Является листиком в дереве. */
export type ExecutorAttrs = CooperationNodeAttrs & {
  profitPercentage: number,
  ownerId: string,
  type: 'EXECUTOR',
}

