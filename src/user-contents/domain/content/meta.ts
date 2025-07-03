import type { FileContent, FileType } from "./struct/file-attrs"
import type { ThesisContent } from "./struct/thesis-attrs"

export type UserContent = ThesisContent | FileContent;

export type ContentTypes = ThesisContent['type'] | FileType;

export type UserContentArMeta = {
  name: "UserContentAr",
  title: "Пользовательский контент",
  attrs: UserContent,
  events: never
}

