
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
