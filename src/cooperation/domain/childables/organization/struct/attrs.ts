import type { ChildableAttrs } from "#cooperation/domain/base/childable/struct/attrs";

/** Кооперация организации.
    Организовывает некоторое пространство и
    берет свою комиссию с их выручки и распределяет своим детям.
*/
export type OrganizationCooperationAttrs = ChildableAttrs & {
  fatherId?: string
  commissionPercentage: number;
  type: 'ORGANIZATION_COOPERATION',
}
