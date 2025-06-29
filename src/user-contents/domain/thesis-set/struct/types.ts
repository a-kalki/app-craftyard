import type { AddThesisSetCommand } from "./thesis-set/add"
import type { DeleteThesisSetCommand } from "./thesis-set/delete"
import type { EditThesisSetCommand } from "./thesis-set/edit"
import type { GetThesisSetCommand } from "./thesis-set/get"
import type { GetOwnerArThesisSetsCommand } from "./thesis-set/get-owner-ar-sets"

export type ThesisSetMutableActions =
  AddThesisSetCommand['name'] |
  DeleteThesisSetCommand['name'] |
  EditThesisSetCommand['name']

export type ThesisSetAllActions =
  ThesisSetMutableActions | 
  GetThesisSetCommand['name'] |
  GetOwnerArThesisSetsCommand['name']
