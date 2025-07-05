import { AggregateRoot } from "rilata/domain";
import type { ModelArMeta } from "./meta";
import type { ModelAttrs } from "./struct/attrs";
import { modelValidator } from "./struct/v-map";
import { dtoUtility } from "rilata/utils";
import type { PatchValue } from "rilata/core";

export class ModelAr extends AggregateRoot<ModelArMeta> {
    name = "ModelAr" as const;

    getShortName(): string {
      return this.getAttrs().title;
    }

    constructor(attrs: ModelAttrs) {
      super(attrs, modelValidator);
    }

    editModel(attrs: Partial<PatchValue<ModelAttrs>>): void {
      const excludeAttrs: Array<keyof ModelAttrs> = ['imageIds', 'ownerId', 'createAt', 'id'];
      const patch = dtoUtility.excludeAttrs(attrs, excludeAttrs);
      // @ts-expect-error: непонятная ошибка типа в updateAt;
      this.attrs = dtoUtility.applyPatch(this.attrs, { ...patch, updateAt: Date.now() });
    }

    addImages(ids: string[]): void {
      const attrs = this.getAttrs({ copy: false });
      ids.forEach(id => attrs.imageIds.push(id));
    }

    reorderImages(ids: string[]): void {
      this.getAttrs({ copy: false }).imageIds = ids;
    }

    deleteImage(id: string): void {
      const attrs = this.getAttrs({ copy: false });
      attrs.imageIds = attrs.imageIds.filter(imageId => imageId !== id);
    }
}
