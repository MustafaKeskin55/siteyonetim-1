/**
 * Güvenli Yerel Depolama Yöneticisi
 * Web ve Capacitor (Native) Ortamları için Uyarlanabilir
 */

const STORAGE_PREFIX = 'sy_mobile_';

export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + key);
      if (!raw) return defaultValue;
      return JSON.parse(raw) as T;
    } catch {
      return defaultValue;
    }
  },

  set: <T>(key: string, value: T): boolean => {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(STORAGE_PREFIX + key);
    } catch {}
  },

  clearAll: (): void => {
    try {
      Object.keys(localStorage).forEach((k) => {
        if (k.startsWith(STORAGE_PREFIX)) {
          localStorage.removeItem(k);
        }
      });
    } catch {}
  },
};
