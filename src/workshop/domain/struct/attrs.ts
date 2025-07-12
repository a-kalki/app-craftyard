export type OrganizationAbout = {
  logo?: string;
  location: string;
}

export type OrganizationAttrs = {
  id: string; // UUID
  title: string;
  description: string;
  about: OrganizationAbout;
  editorIds: string[];
  employeeIds: string[];
  createAt: number;
  updateAt: number;
}

export type WorkshopContentTypes = 'rooms' | 'machines';

export type WorkshopAttrs = OrganizationAttrs & {
  masterIds: string[];
  mentorIds: string[];
};
