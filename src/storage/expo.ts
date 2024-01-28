import { getItem, setItem } from "expo-secure-store";
import type { SecureStoreOptions } from "expo-secure-store";
export class ExpoSecureStore {
  private options: SecureStoreOptions = {};
  constructor(options?: SecureStoreOptions) {
    this.options = options ?? {};
  }

  get(key: string) {
    return getItem(key, this.options);
  }

  set(key: string, value: string) {
    return setItem(key, value, this.options);
  }
}
