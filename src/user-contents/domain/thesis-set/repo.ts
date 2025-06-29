import type { ThesisSetAttrs } from "#user-contents/domain/thesis-set/struct/attrs";
import type { MaybePromise } from "rilata/core";

export interface ThesisSetRepo {
  findThesisSet(id: string): MaybePromise<ThesisSetAttrs | undefined>

  getThesisSets(): MaybePromise<ThesisSetAttrs[]>

  addThesisSet(attrs: ThesisSetAttrs): MaybePromise<{ changes: number }>

  updateThesisSet(id: string, patch: Partial<ThesisSetAttrs>): MaybePromise<{ changes: number }>

  getOwnerArThesisSets(ownerId: string): MaybePromise<ThesisSetAttrs[]>

  deleteThesisSet(id: string): MaybePromise<{ changes: number }>
}
