import type { FileContent, FileType } from "./struct/file-attrs"
import type { ImagesContent } from "./struct/images-attrs";
import type { ThesisContent } from "./struct/thesis-attrs"

export type UserContent = ThesisContent | FileContent | ImagesContent;

export type ContentTypes = ThesisContent['type'] | FileType | ImagesContent['type'];

export type UserContentArMeta = {
  name: "UserContentAr",
  title: "Пользовательский контент",
  attrs: UserContent,
  events: never
}

