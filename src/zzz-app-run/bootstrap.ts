import type { UserDod } from "../app/app-domain/dod";
import { bootstrap } from "../app/ui/base/bootstrap";
import type { ModuleManifest } from "../app/ui/base/run-types";
import { userModuleComponentCtors } from "../users/ui/components";
import { usersModule } from "../users/ui/module";

function initTelegramWebApp() {
  if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.expand();
  }
}

function getUserFromTgUser(): UserDod {
  const initDataUnsafe = window.Telegram.WebApp.initDataUnsafe;
  const user = initDataUnsafe?.user;
  if (!user) {
    throw new Error('User not found');
  }

  return {
    id: String(user.id),
    name: `${user.first_name} ${user.last_name || ''}`.trim(),
    roles: ['HOBBYIST'],
    profile: {
      skills: {},
      avatarUrl: user.photo_url,
    },
    joinedAt: Date.now(),
  };
}

function checkTelegramWebApp() {
  if (!window.Telegram?.WebApp) {
    throw new Error('Telegram Web App not initialized');
  }
}

function getNurUser(): UserDod {
  const user = {
    allows_write_to_pm: true,
    first_name: "Нурболат",
    id: 773084180,
    is_premium: true,
    language_code: "ru",
    last_name: "",
    photo_url: "https://t.me/i/userpic/320/bOrpGbX5Jq3fbysH_VoGshRjzc7AAw_J6UARzLI-qUQ.svg",
    username: "anzUralsk",
  }

  return {
    id: user.id.toString(),
    name: `${user.first_name} ${user.last_name || ''}`.trim(),
    roles: ['HOBBYIST'],
    profile: {
      skills: {},
      avatarUrl: user.photo_url,
    },
    joinedAt: Date.now(),
  };
}

const manifests: ModuleManifest[] = [
  { module: usersModule, componentCtors: userModuleComponentCtors },
]

bootstrap(manifests, getNurUser);
