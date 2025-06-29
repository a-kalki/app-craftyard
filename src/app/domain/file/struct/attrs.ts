export type SubDir =
  | 'avatars'
  | 'model-images'
  | 'model-draws';

export type FileEntryAttrs = {
  id: string;
  url: string;
  mimeType: string;
  size: number;
  ownerId: string;
  access: 'public' | 'private';
  comment?: string;
  uploadedAt: number;
};
