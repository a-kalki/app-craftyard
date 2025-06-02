import {} from '../../components'; // регистрация компонентов
import { root } from '../../domain/user/constants';
import type { RegisterUserCommand } from '../../domain/user/contracts';
import type { UserDod } from '../../domain/user/dod';
import { App } from './app';
import { Module } from './module';

function initTelegramWebApp() {
  if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.expand();
  }
}

function getUserFromTelegram(): RegisterUserCommand['dto'] {
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
    }
  };
}

function getUserFromTelegramMock(): UserDod {
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

function pickApp(app: App): void {
  (window as any).app = app;
}

const modules: Module[] = [
  new Module('app', 'Приложение', [{
      root: root,
      title: 'Пользователи',
      urlPatterns: ['users', 'users/:modelId'],
  }]),
  new Module('product', 'Продукты', [
    {
      root: 'models',
      title: 'Модели',
      urlPatterns: ['models', 'models/:modelId'],
    },
    {
      root: 'products',
      title: 'Изделия',
      urlPatterns: ['products', 'products/:productId'],
    },
  ])
]

async function bootstrap() {
  const body = document.getElementById('root');
  if (!body) {
    throw new Error('Root element not found');
  }

  try {
    // initTelegramWebApp();
    if (!window.Telegram.WebApp.platform) {
      throw new Error('Telegram Web App not initialized');
    }

    const user = getUserFromTelegramMock();
    const app = new App(modules, user);
    pickApp(app);
    const appPage = document.createElement('app-page');
    (appPage as any).app = app;
    body.innerHTML = '';
    body.appendChild(appPage);
  } catch (err) {
    console.error('Ошибка загрузки приложения:', err);
    body.innerHTML = '<p>Произошла ошибка при загрузке приложения. Убедитесь что вы запускаете приложение внутри Telegram  и попробуйте обновить страницу.</p>';
  }
}

bootstrap();
