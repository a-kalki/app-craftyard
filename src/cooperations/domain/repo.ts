import type { MaybePromise } from "rilata/core";
import type { CooperationAttrs } from "./types";

export interface CooperationRepo {
  find(id: string): MaybePromise<CooperationAttrs | undefined>

  getAll(): MaybePromise<CooperationAttrs[]>

  filter(attrs: Partial<CooperationAttrs>): MaybePromise<CooperationAttrs[]>

  getRootAttrs(rootId: string): MaybePromise<CooperationAttrs[]>

  getWorkshopAttrs(workshopId: string): MaybePromise<CooperationAttrs[]>
}
