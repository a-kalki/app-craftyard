import { LitElement } from 'lit';
import type { App } from '../base/app';
import type { WorkshopsBackendApi } from '#workshop/ui/workshops-api';
import type { FileFacade } from '#app/domain/file/facade';
import type { UsersBackendApi } from '#users/ui/users-api';
import type { ModelsBackendApi } from '#models/ui/models-api';
import type { FileBackendLocalApi } from '#files/ui/files-api';
import type { UserFacade } from '#app/domain/user/facade';
import type { ModelsFacade } from '#models/domain/facade';
import type { WorkshopsFacade } from '#workshop/domain/facade';

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

  get usersFacade(): UserFacade {
    return this.globalAttr('userFacade');
  }

  get fileFacade(): FileFacade {
    return this.globalAttr('fileFacade');
  }

  get modelFacade(): ModelsFacade {
    return this.globalAttr('modelFacade');
  }

  get workshopFacade(): WorkshopsFacade {
    return this.globalAttr('workshopFacade');
  }
}
