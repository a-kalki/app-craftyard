import type { AddContentSectionCommand } from "./add"
import type { DeleteContentSectionCommand } from "./delete"
import type { EditContentSectionCommand } from "./edit"
import type { GetContentSectionCommand } from "./get"
import type { GetOwnerArContentSectionsCommand } from "./get-owner-ar-sets"

export type ContentSectionMutableActions =
  AddContentSectionCommand['name'] |
  DeleteContentSectionCommand['name'] |
  EditContentSectionCommand['name']

export type ContentSectionAllActions =
  ContentSectionMutableActions | 
  GetContentSectionCommand['name'] |
  GetOwnerArContentSectionsCommand['name']
