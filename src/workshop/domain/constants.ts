import type { CommissionStrategy, IndividualCommission, WorkshopPrivelegies } from "./struct/attrs";

export const commissionStrategyTypes: CommissionStrategy['type'][] = ['FIXED'];

export const individualCommissionTypes: IndividualCommission['type'][] = ['FIXED'];

export const workshopPrivelegyTypes: WorkshopPrivelegies[] = [
  'CAN_ALL', 'CAN_MODIFY_COMMISSION', 'CAN_MANAGE_BOOKINGS'
];
