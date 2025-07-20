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
import type { UiModelsFacade } from "#models/domain/facade";
import type { UiWorkshopsFacade } from "#workshop/domain/facade";
import { userContentModule } from "#user-contents/ui/module";
import type { UiFileFacade } from "#files/ui/facade";
import { ContentSectionBackendApi } from "#user-contents/ui/section-api";
import { UserContentBackendApi } from "#user-contents/ui/content-api";
import { OffersBackendApi } from "#offer/ui/offers-api";
import { offersModule } from "#offer/ui/module";
import { cooperationsModule } from "#cooperation/ui/module";
import { CooperationBackendApi } from "#cooperation/ui/cooperation-api";

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
  offersModule,
  cooperationsModule,
]

// токен будет истекшим до наступления этот периода
const expiredTimeShiftAsMs = 3000;

// данные будут уничтожаться с кэше запросов в бэк при наступлении этого периода
const cacheTtlAsMin = 5;

const jwtDecoder = new BaseJwtDecoder(expiredTimeShiftAsMs);

const resolves: BootstrapResolves = {
  userFacade: new UsersBackendApi(jwtDecoder, cacheTtlAsMin),
  jwtDecoder,
}

const otherApis = {
  ...resolves,
  fileFacade: new FileBackendLocalApi(jwtDecoder, cacheTtlAsMin),
  modelApi: new ModelsBackendApi(jwtDecoder, cacheTtlAsMin),
  workshopApi: new WorkshopsBackendApi(jwtDecoder, cacheTtlAsMin),
  contentSectionApi: new ContentSectionBackendApi(jwtDecoder, cacheTtlAsMin),
  userContentApi: new UserContentBackendApi(jwtDecoder, cacheTtlAsMin),
  offerApi: new OffersBackendApi(jwtDecoder, cacheTtlAsMin),
  cooperationApi: new CooperationBackendApi(jwtDecoder, cacheTtlAsMin),
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

Object.keys(withFacades).forEach((key) => {
  // @ts-expect-error
  (window as any)[key] = withFacades[key];
});

// все пользователи будут считаться привязанными к мастерской Дедок
(window as any).userWorkshop = (await otherApis.workshopApi.getWorkshop('4e82828c-43c9-4fb5-9716-e31b03103c29')).value;

new Bootstrap(modules, withFacades).start();
