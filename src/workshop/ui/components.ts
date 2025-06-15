import type { BaseElement } from "#app/ui/base/base-element"
import { WorkshopIndividualCommissionCard } from "./widgets/individual-comission-card"
import { WorkshopBasicInfo } from "./widgets/workshop-basic-info"
import { WorkshopDetailsEntity } from "./widgets/workshop-detail"
import { WorkshopHobbyistsSection } from "./widgets/workshop-hobbyists-section"
import { WorkshopMastersSection } from "./widgets/workshop-masters-section"
import { WorkshopRoomsSection } from "./widgets/workshop-rooms-section"

export const workshopsModuleComponentCtors: (typeof BaseElement)[] = [
  WorkshopBasicInfo,
  WorkshopDetailsEntity,
  WorkshopHobbyistsSection,
  WorkshopMastersSection,
  WorkshopRoomsSection,
  WorkshopIndividualCommissionCard,
]

