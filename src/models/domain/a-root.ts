import { AggregateRoot } from "rilata/domain";
import type { ModelArMeta } from "./meta";
import type { ModelAttrs } from "./struct/attrs";
import { modelValidator } from "./v-map";

export class ModelAr extends AggregateRoot<ModelArMeta> {
    name = "ModelAr" as const;

    getShortName(): string {
      return this.getAttrs().title;
    }

    constructor(attrs: ModelAttrs) {
      super(attrs, modelValidator);
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
