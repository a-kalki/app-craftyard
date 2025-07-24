import { customElement } from 'lit/decorators.js';
import { UserDetailsEntity } from './user-details';

@customElement('my-profile')
export class MyProfileEntity extends UserDetailsEntity {

  protected getUserId(): string {
    return this.app.assertAuthUser().id;
  }
}

