import {} from '../shoelace';
import {} from '../app-components'

import { App } from './app';
import type { ModuleManifest } from './run-types';
import type { UserDod } from '../../app-domain/dod';

export async function bootstrap(moduleManifests: ModuleManifest[], getUser: () => UserDod): Promise<void> {
  const body = document.getElementById('root');
  if (!body) {
    throw new Error('Root element not found');
  }

  try {
    const user = getUser();
    const app = new App(moduleManifests, user);
    app.init();
    const appPage = document.createElement('app-page');
    body.innerHTML = '';
    body.appendChild(appPage);
  } catch (err) {
    console.error('Ошибка загрузки приложения:', err);
    body.innerHTML = '<p>Произошла ошибка при загрузке приложения. Убедитесь что вы запускаете приложение внутри Telegram  и попробуйте обновить страницу.</p>';
  }
}
