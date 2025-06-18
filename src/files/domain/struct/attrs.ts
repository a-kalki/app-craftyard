export type FileAccessType =
  { type: 'public' }
  | { type: 'private' }

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
  access: FileAccessType;
  comment?: string;
  uploadedAt: number;
};
