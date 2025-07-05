export type WorkshopContentTypes = 'rooms' | 'machines';

export type WorkshopAttrs = {
  id: string; // UUID
  title: string;
  description: string;
  about: WorkshopAbout;
  editorIds: string[];
  createAt: number;
  updateAt: number;
};

export type WorkshopAbout = {
  logo?: string;
  location: string;
}
