import type { AddContentSectionCommand } from "./add-section/contract"
import type { DeleteContentSectionCommand } from "./delete-section/contract"
import type { EditContentSectionCommand } from "./edit-section/contract"
import type { GetOwnerArContentSectionsCommand } from "./get-owner-sections/contract"
import type { GetContentSectionCommand } from "./get-section/contract"

export type ContentSectionMutableActions =
  AddContentSectionCommand['name'] |
  DeleteContentSectionCommand['name'] |
  EditContentSectionCommand['name']

export type ContentSectionAllActions =
  ContentSectionMutableActions | 
  GetContentSectionCommand['name'] |
  GetOwnerArContentSectionsCommand['name']
