import type { WorkshopAttrs } from "#workshop/domain/struct/attrs";
import type { MaybePromise } from "rilata/core";

export interface WorkshopRepo {
  findWorkshop(id: string): MaybePromise<WorkshopAttrs | undefined>

  getWorkshops(): MaybePromise<WorkshopAttrs[]>
}
