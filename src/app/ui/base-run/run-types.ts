import type { UiUserFacade } from "#app/domain/user/facade";
import type { WorkshopsBackendApi } from "#workshop/ui/workshops-api";
import type { JwtDecoder, JwtDto } from "rilata/core";

export type DebugUserMode = {
  isDebugMode: true,
  user: TelegramWidgetUserData,
} | {
  isDebugMode: false
}

export type BootstrapResolves = {
  userFacade: UiUserFacade,
  workshopApi: WorkshopsBackendApi,
  jwtDecoder: JwtDecoder<JwtDto>,
  debugUserMode: DebugUserMode,
}

export type TelegramUser = {
  id: string;
  first_name: string;
  username?: string;
  photo_url?: string,
  [key: string]: string | number | undefined;
}

export type TelegramWidgetUserData = {
  id: number;
  first_name: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
  [key: string]: unknown;
}
