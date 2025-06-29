import type { Module } from "#app/ui/base/module";
import { modelsModule } from "#models/ui/module";
import { workshopsModule } from "#workshop/ui/module";
import { BaseJwtDecoder } from "rilata/core";
import { Bootstrap } from "../../app/ui/base-run/bootstrap";
import type { BootstrapResolves, TelegramWidgetUserData } from "../../app/ui/base-run/run-types";
import { usersModule } from "../../users/ui/module";
import { UsersBackendApi } from "../../users/ui/users-api";
import { filesModule } from "src/files/ui/module";
import { FileBackendLocalApi } from "#files/ui/files-api";
import { ModelsBackendApi } from "#models/ui/models-api";
import { WorkshopsBackendApi } from "#workshop/ui/workshops-api";
import type { UiUserFacade } from "#app/domain/user/facade";
import type { UiFileFacade } from "#app/domain/file/facade";
import type { UiModelsFacade } from "#models/domain/facade";
import type { UiWorkshopsFacade } from "#workshop/domain/facade";
import { userContentModule } from "#user-contents/ui/module";
import { ThesisSetBackendApi } from "#user-contents/ui/thesis-set-api";

const debugAuthUser: TelegramWidgetUserData = {
  id: 773084180,
  first_name: 'Нурболат',
  username: 'anzUralsk',
  auth_date: Date.now() / 1000,
  hash: 'debug'
};

(window as any).debugAuthUser = debugAuthUser;

const modules: Module[] = [
  filesModule,
  userContentModule,
  usersModule,
  workshopsModule,
  modelsModule,
]

// токен будет истекшим до наступления этот периода
const expiredTimeShiftAsMs = 3000;

// данные будут уничтожаться с кэше запросов в бэк при наступлении этого периода
const cacheTtlAsMin = 5;

const jwtDecoder = new BaseJwtDecoder(expiredTimeShiftAsMs);

const resolves: BootstrapResolves = {
  userFacade: new UsersBackendApi(jwtDecoder, cacheTtlAsMin),
  fileFacade: new FileBackendLocalApi(jwtDecoder, cacheTtlAsMin),
  jwtDecoder,
}

const otherApis = {
  ...resolves,
  modelApi: new ModelsBackendApi(jwtDecoder, cacheTtlAsMin),
  workshopApi: new WorkshopsBackendApi(jwtDecoder, cacheTtlAsMin),
  thesisSetApi: new ThesisSetBackendApi(jwtDecoder, cacheTtlAsMin),
}

type Facades = {
  userApi: UiUserFacade,
  fileApi: UiFileFacade,
  modelFacade: UiModelsFacade,
  workshopFacade: UiWorkshopsFacade,
}

const withFacades: BootstrapResolves & Facades = {
  ...otherApis,
  userApi: otherApis.userFacade,
  fileApi: otherApis.fileFacade,
  modelFacade: otherApis.modelApi,
  workshopFacade: otherApis.workshopApi,
}

// нужно удалить после удаления библиотеки lit;
Object.keys(withFacades).forEach((key) => {
  // @ts-expect-error
  (window as any)[key] = withFacades[key];
})

new Bootstrap(modules, withFacades).start();

