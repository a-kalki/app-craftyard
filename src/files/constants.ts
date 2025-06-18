import type { SubDir } from "#app/domain/file/struct/attrs";
import type { UnionToTuple } from "rilata/core";

export const fileApiUrls = '/api/files/'

export const formFileName = 'file';

export const fileSubDirs: UnionToTuple<SubDir> = [
  'avatars',
  'model-images',
  'model-draws',
]
