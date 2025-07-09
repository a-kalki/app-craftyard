import type { EventMeta } from "rilata/domain"
import type { CooperationNodeAttrs } from "./struct/attrs"

export type NodeArMeta = {
  name: string,
  title: string,
  attrs: CooperationNodeAttrs,
  events: EventMeta
}
