import { customElement } from 'lit/decorators.js';
import { UserDetailsEntity } from './user-details';

@customElement('my-profile')
export class MyProfileEntity extends UserDetailsEntity {
  static routingAttrs = {
    pattern: '/my-profile',
    tag: 'my-profile',
  };

  protected getUserId(): string {
    return this.app.getState().currentUser.id;
  }
}

