import type { UnionToTuple } from "rilata/core";
import type { SubDir } from "./domain/struct/attrs";

export const fileApiUrls = '/api/files/'

export const formFileName = 'file';

export const fileSubDirs: UnionToTuple<SubDir> = [
  'avatars',
  'model-images',
  'model-draws',
]
