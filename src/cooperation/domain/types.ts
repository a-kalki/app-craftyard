import type { CooperationNodeAttrs } from "./base/node/struct/attrs";
import type { CommandCooperationAr } from "./childables/command/a-root";
import type { CommandCooperationAttrs } from "./childables/command/struct/attrs";
import type { OfferCooperationAr } from "./childables/offer/a-root";
import type { OfferCooperationAttrs } from "./childables/offer/struct/attrs";
import type { OrganizationCooperationAr } from "./childables/organization/a-root";
import type { OrganizationCooperationAttrs } from "./childables/organization/struct/attrs";
import type { ExecutorAr } from "./executor/a-root";
import type { ExecutorAttrs } from "./executor/struct/attrs";

export type CooperationAttrs =
  ExecutorAttrs
  | CommandCooperationAttrs
  | OfferCooperationAttrs
  | OrganizationCooperationAttrs

export type CooperationType = CooperationAttrs['type'];

export type CooperationAr =
  ExecutorAr
  | CommandCooperationAr
  | OfferCooperationAr
  | OrganizationCooperationAr

type ConcreteCooperationAttrs =
  Partial<ExecutorAttrs>
  & Partial<CommandCooperationAttrs>
  & Partial<OfferCooperationAttrs>
  & Partial<OrganizationCooperationAttrs>

type FullCooperationAttrs = Omit<ConcreteCooperationAttrs, keyof CooperationNodeAttrs> & CooperationNodeAttrs;

/** Объект записи в репозиторий */
export type CooperationDbo = Omit<FullCooperationAttrs, 'type'> & { type: CooperationType };
