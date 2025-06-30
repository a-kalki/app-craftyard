import { LitElement } from 'lit';
import type { App } from '../base/app';
import type { WorkshopsBackendApi } from '#workshop/ui/workshops-api';
import type { UsersBackendApi } from '#users/ui/users-api';
import type { ModelsBackendApi } from '#models/ui/models-api';
import type { FileBackendLocalApi } from '#files/ui/files-api';
import type { UiUserFacade } from '#app/domain/user/facade';
import type { UiModelsFacade } from '#models/domain/facade';
import type { UiWorkshopsFacade } from '#workshop/domain/facade';
import type { ThesisSetBackendApi } from '#user-contents/ui/thesis-set-api';
import type { UiFileFacade } from '#files/ui/facade';

export abstract class BaseElement extends LitElement {
  protected globalAttr<T>(key: string): T {
    const item = (window as any)[key];
    if (!item) throw new Error(key + ' context not found');
    return item;
  }
  protected get app(): App {
    return this.globalAttr<App>('app');
  }

  get userApi(): UsersBackendApi {
    return this.globalAttr('userApi');
  }

  get fileApi(): FileBackendLocalApi {
    return this.globalAttr('fileApi');
  }

  get modelApi(): ModelsBackendApi {
    return this.globalAttr('modelApi');
  }

  get workshopApi(): WorkshopsBackendApi {
    return this.globalAttr('workshopApi');
  }

  get usersFacade(): UiUserFacade {
    return this.globalAttr('userFacade');
  }

  get fileFacade(): UiFileFacade {
    return this.globalAttr('fileFacade');
  }

  get modelFacade(): UiModelsFacade {
    return this.globalAttr('modelFacade');
  }

  get workshopFacade(): UiWorkshopsFacade {
    return this.globalAttr('workshopFacade');
  }

  get thesisSetApi(): ThesisSetBackendApi {
    return this.globalAttr('thesisSetApi')
  }
}
