import type { UiFileFacade } from "#app/domain/file/facade";
import type { UiUserFacade } from "#app/domain/user/facade";
import type { JwtDecoder, JwtDto } from "rilata/core";

export type BootstrapResolves = {
  userFacade: UiUserFacade,
  fileFacade: UiFileFacade,
  jwtDecoder: JwtDecoder<JwtDto>,
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
