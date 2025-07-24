import type { ModelAttrs } from "./struct/attrs";

export interface ModelRepo {
  filter(attrs: Partial<ModelAttrs>): Promise<ModelAttrs[]>

  findModel(id: string): Promise<ModelAttrs | undefined>

  update(attrs: ModelAttrs): Promise<{ changes: number }>
}
