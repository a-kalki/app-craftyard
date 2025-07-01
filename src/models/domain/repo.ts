import type { ModelAttrs } from "./struct/attrs";

export interface ModelRepo {
  getModels(): Promise<ModelAttrs[]>

  findModel(id: string): Promise<ModelAttrs | undefined>

  update(attrs: ModelAttrs): Promise<{ changes: number }>
}
