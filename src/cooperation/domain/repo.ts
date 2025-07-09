import type { MaybePromise } from "rilata/core";
import type { CooperationDbo } from "./types";

export interface CooperationRepo {
  find(id: string): MaybePromise<CooperationDbo>

  getAll(): MaybePromise<CooperationDbo[]>

  filter(attrs: Partial<CooperationDbo>): MaybePromise<CooperationDbo[]>
}
