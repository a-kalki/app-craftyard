import { BaseElement } from "../../app/ui/base/base-element";
import { ModelImagesEntity } from "./entity/model-images";
import { ModelCardWidget } from "./widgets/model-card";
import { ModelDetailsWidget } from "./widgets/model-details";
import { ModelsWidget } from "./widgets/models";

export const modelsModuleComponentCtors: (typeof BaseElement)[] = [
  ModelsWidget,
  ModelCardWidget,
  ModelDetailsWidget,

  ModelImagesEntity,
]
