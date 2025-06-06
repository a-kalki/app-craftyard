import type { Command } from "../../api/base/types";
import type { App } from "./app";
import { AppNotifier } from "./app-notifier";

const API_PREFIX = '/api';

export abstract class RootApi {
  protected abstract rootEndpoint: string;

  protected app?: App;

  // до загрузки приложения, app.error() не доступен.
  // поэтому у rootApi свой notifier
  protected notifier = new AppNotifier();

  protected async post<T>(
    body: Command,
    customHeaders?: HeadersInit
  ): Promise<T> {
    try {
      // если приложение еще не инициализировано, то значит пользователь не залогинен
      if (!this.app) {
        this.app = (window as any).app;
      }
      const currUserId = this.app?.getState()?.currentUser?.id ?? 'user not logined';

      const response = await this.request({
        method: 'POST',
        body: JSON.stringify({ ...body, currUserId }),
        headers: customHeaders,
      });

      return response.json();

    } catch (err) {
      this.notifier.error('При загрузке данных произошла ошибка', {
        url: this.getPath(),
        body,
        error: err,
      });
      throw err;
    }
  }

  protected async request(options: RequestInit = {}): Promise<Response> {
    const response = await fetch(this.getPath(), {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (response.ok) {
      if (response.status !== 200) {
        this.notifier.error('При загрузке данных произошла ошибка', {
          status: response.status,
          statusText: response.statusText,
        })
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }
      return response;
    }

    this.notifier.error('При загрузке данных произошла ошибка', {
      status: response.status,
      statusText: response.statusText,
    })
    throw new Error(
      `HTTP ${response.status} ${response.statusText}`
    );
  }

  protected error(text: string, details?: unknown) {
    
  }

  protected getPath(): string {
    return `${API_PREFIX}/${this.rootEndpoint}`;
  }
}

