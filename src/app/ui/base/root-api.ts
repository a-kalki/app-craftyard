import type { App } from "./app";

const API_PREFIX = '/api';

export abstract class RootApi {
  protected abstract rootEndpoint: string;

  protected app!: App;

  protected async post<T>(
    body?: unknown,
    customHeaders?: HeadersInit
  ): Promise<T> {
    try {
      return this.request<T>({
        method: 'POST',
        body: body ? JSON.stringify(body) : undefined,
        headers: customHeaders,
      });

    } catch (err) {
      this.app.error('При загрузке данных произошла ошибка', {
        url: this.getPath(),
        body,
        error: err,
      });
      throw err;
    }
  }

  protected async request<T>(options: RequestInit = {}): Promise<T> {
    if (this.app === undefined) {
      this.app = (window as any).app;
    }
    const response = await fetch(this.getPath(), {
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': this.app.getState().currentUser.id,
        ...options.headers,
      },
      ...options,
    });

    if (response.ok) {
      if (response.status !== 200) {
        this.app.error('При загрузке данных произошла ошибка', {
          status: response.status,
          statusText: response.statusText,
        })
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }
      return response.json();
    }

    this.app.error('При загрузке данных произошла ошибка', {
      status: response.status,
      statusText: response.statusText,
    })
    throw new Error(
      `HTTP ${response.status} ${response.statusText}`
    );
  }

  protected getPath(): string {
    return `${API_PREFIX}/${this.rootEndpoint}`;
  }
}

