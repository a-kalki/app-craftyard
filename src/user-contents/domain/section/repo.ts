import type { MaybePromise } from "rilata/core";
import type { ContentSectionAttrs } from "./struct/attrs";

export interface ContentSectionRepo {
  findContentSection(id: string): MaybePromise<ContentSectionAttrs | undefined>

  getContentSections(): MaybePromise<ContentSectionAttrs[]>

  addContentSection(attrs: ContentSectionAttrs): MaybePromise<{ changes: number }>

  updateContentSection(id: string, patch: Partial<ContentSectionAttrs>): MaybePromise<{ changes: number }>

  getOwnerArContentSections(ownerId: string): MaybePromise<ContentSectionAttrs[]>

  deleteContentSection(id: string): MaybePromise<{ changes: number }>
}
