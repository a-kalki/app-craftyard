import type { Cost } from "#app/core/types";
import type { CooperationType } from "#cooperations/domain/types";

export type CooperationValidationError = {
  nodeId: string,
  nodeTitle: string,
  errName: string,
  description: string,
  type: 'system-error' | 'error' | 'warning',
}

export type CooperationStructureValidationResult = {
  isValid: boolean;
  errors: CooperationValidationError[];
  warnings: CooperationValidationError[];
  sysErrors: CooperationValidationError[];
};

export type TreeDistributionResult = {
  [id: string]: {
    inputValue: Cost,
    title: string,
    flowType: 'transit' | 'profit';
    type: CooperationType,
    father?: TreeDistributionResult,
    childs?: TreeDistributionResult[]
  }
}
