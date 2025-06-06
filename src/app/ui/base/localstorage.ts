export const currentUserKey = 'currentUser';

export const localStore = {
  set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  },

  get<T>(key: string): T | undefined {
    const item = localStorage.getItem(key);
    if (!item) return;
    try {
      return JSON.parse(item) as T;
    } catch {
      return;
    }
  },

  remove(key: string): void {
    localStorage.removeItem(key);
  },

  clear(): void {
    localStorage.clear();
  }
};
