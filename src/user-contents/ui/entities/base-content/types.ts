import type { CyOwnerAggregateAttrs } from "#app/domain/types"
import type { UserContent } from "#user-contents/domain/content/meta"

export interface EditUserContentModalDialog {
  show(
    content: UserContent,
    ownerAttrs: CyOwnerAggregateAttrs,
  ): Promise<'success' | null>
}

export interface AddUserContentModalDialog {
  show(
    sectionId: string,
    ownerAttrs: CyOwnerAggregateAttrs,
  ): Promise<{ contentId: string } | null>
}
