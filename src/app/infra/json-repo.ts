// @ts-expect-error: по какой то причине этот импорт вызывает ошибку линтера
import fs from "fs-extra";

export class JsonRepository<T> {
  private cache: { [key: string]: any } = {};
  private cacheLoadPromise: Promise<void> | null = null;
  private saveLock: Promise<void> = Promise.resolve();

  constructor(private filePath: string) {}

  private async ensureReady(): Promise<void> {
    if (!this.cacheLoadPromise) {
      this.cacheLoadPromise = (async () => {
        if (await fs.pathExists(this.filePath)) {
          this.cache = await fs.readJson(this.filePath);
        } else {
          this.cache = {};
        }
      })();
    }
    await this.cacheLoadPromise;
  }

  private async saveCache(): Promise<void> {
    await this.ensureReady();

    // Ставим текущую запись в очередь
    this.saveLock = this.saveLock.then(
      () => fs.writeJson(this.filePath, this.cache, { spaces: 2 })
    );

    await this.saveLock;
  }

  public async update(key: string, data: T): Promise<void> {
    await this.ensureReady();
    this.cache[key] = data;
    await this.saveCache();
  }

  public async find(key: string): Promise<T | undefined> {
    await this.ensureReady();
    return this.cache[key];
  }

  public async getAll(): Promise<T[]> {
    await this.ensureReady();
    return Object.values(this.cache);
  }

  public async delete(key: string): Promise<void> {
    await this.ensureReady();
    delete this.cache[key];
    await this.saveCache();
  }

  public async has(key: string): Promise<boolean> {
    await this.ensureReady();
    return key in this.cache;
  }
}
