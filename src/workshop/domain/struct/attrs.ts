import type { CustomContent } from "#app/domain/types";

export type WorkshopAttrs = {
  id: string; // UUID
  title: string;
  description: string;
  about: WorkshopAbout;
  memberships: WorkshopMembership[];
  subscriptionPlans: SubscriptionPlan[];
  commissionStrategy: CommissionStrategy;
  individualCommissions: IndividualCommission[];
  rooms: WorkshopRoom[];
};

export type WorkshopAbout = {
  logo?: string;
  location: string;
  customContent?: CustomContent[];
}

export type SubscriptionPlan = {
  id: string;
  title: string;
  description: string;
  durationDays: number;
  price: number; // в минимальных единицах (например, тыйын)
};

export type CommissionStrategy = {
  type: 'FIXED';
  productCommissionPercent: number;
  programCommissionPercent: number;
};

export type IndividualCommission = {
  id: string;
  userId: string; // мастер или ментор
  type: 'FIXED';
  appliedByStaffId: string; // кто выдал
  reason: string;
  productCommissionPercent?: number;
  programCommissionPercent?: number;
  issuedAt: number; // выдано когда
  validUntil: number; // действует до когда
};

export type WorkshopRoom = {
  id: string;
  title: string;
  description: string,
  machineList: string[];
  workstations: WorkstationAttrs[];
};

export type WorkstationAttrs = {
  id: string;
  title: string;
  description: string;
};

export type WorkshopMembership = {
  id: string;
  userId: string;
  workshopId: string;
  role: string;
  joinedAt: number;
  leftAt?: number;
  privileges: WorkshopPrivelegies[];
};

export type WorkshopPrivelegies =
  'CAN_ALL' |
  'CAN_MODIFY_COMMISSION' |
  'CAN_MANAGE_BOOKINGS';
