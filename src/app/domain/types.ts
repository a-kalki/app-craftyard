import type { AccessType } from "#user-contents/domain/section/struct/attrs";
import type { OwnerAggregateAttrs } from "rilata/core";

export type CyOwnerAggregateAttrs = Omit<OwnerAggregateAttrs, 'access'> & {
  access: AccessType,
}

export type SkillLevel = 'BEGINNER' | 'INTERMEDIATE' | 'EXPERT';

export type Currency = {
  'KZT': 'Тенге'
};

export type Cost = {
  price: number;
  currency: keyof Currency;
};
