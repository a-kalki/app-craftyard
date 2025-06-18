import { UserPolicy } from "#app/domain/user/policy";
import type { JwtUser } from "#app/domain/user/struct/attrs";
import type { FileEntryAttrs } from "./struct/attrs";

export class FilePolicy {
  protected userIsModerator: boolean;

  constructor( private currentUser: JwtUser) {
    this.userIsModerator = new UserPolicy(currentUser).isModerator();
  }

  canEdit(file: FileEntryAttrs): boolean {
    return this.isModerator() || this.isOwner(file);
  }

  canDelete(file: FileEntryAttrs): boolean {
    return this.isModerator() || this.isOwner(file);
  }

  canGetFile(file: FileEntryAttrs): boolean {
    return file.access.type === 'public' || this.isOwner(file) || this.isModerator();
  }

  protected isModerator(): boolean {
    return this.userIsModerator;
  }

  protected isOwner(file: FileEntryAttrs): boolean {
    return file.ownerId === this.currentUser.id;
  }
}

