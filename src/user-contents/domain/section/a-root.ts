import { type PatchValue } from "rilata/core";
import { AggregateRoot } from "rilata/domain";
import { dtoUtility } from "rilata/utils";
import type { ContentSectionArMeta } from "./meta";
import type { ContentSectionAttrs } from "./struct/attrs";
import { contentSectionValidator } from "./v-map";

export class ContentSectionAr extends AggregateRoot<ContentSectionArMeta> {
  name = 'ContentSectionAr' as const;

  constructor(attrs: ContentSectionAttrs) {
    super(attrs, contentSectionValidator)
  }

  getShortName(): string {
    return this.attrs.title;
  }

  editAttrs(patchAttrs: PatchValue<Partial<ContentSectionAttrs>>): void {
    const exludeAttrs: Array<keyof ContentSectionAttrs> = ['id', 'ownerId', 'context', 'createAt'];
    const toPatch = dtoUtility.excludeAttrs(patchAttrs, exludeAttrs);
    // @ts-expect-error: непонятная ошибка типа в updateAt;
    this.attrs = dtoUtility.applyPatch(this.getAttrs(), { ...toPatch, updateAt: Date.now() });
    this.checkInvariants();
  }
}
