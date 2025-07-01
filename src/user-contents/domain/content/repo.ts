import type { MaybePromise } from "rilata/core";
import type { UserContent } from "./meta";

export interface UserContentRepo {
  findContent<C extends UserContent>(id: string): MaybePromise<C | undefined>

  filterContent<C extends UserContent>(filterAttrs: Partial<C>): MaybePromise<C[]>

  addContent<C extends UserContent>(attrs: C): MaybePromise<{ changes: number }>

  updateContent<C extends UserContent>(attrs: C): MaybePromise<{ changes: number }>

  deleteContent(id: string): MaybePromise<{ changes: number }>
}
