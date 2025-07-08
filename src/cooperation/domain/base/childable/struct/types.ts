import type { CooperationAr } from "#cooperation/domain/types"

export type CheckStructureData = {
  childrenDistributionShares?: CooperationAr[],
  fatherDistributionShare?: CooperationAr
}
