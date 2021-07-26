export interface IStorageItem {
  key: string;
  value: any;
}

export class StorageHelper {
  localStorageSupported: boolean;

  constructor() {
    this.localStorageSupported =
      typeof window['localStorage'] != 'undefined' && window['localStorage'] != null;
  }

  // add value to storage
  add(key: string, item: any) {
    if (this.localStorageSupported) {
      const dataJson = JSON.stringify(item);
      localStorage.setItem(key, dataJson);
    }
  }

  // get one item by key from storage
  get(key: string): any | null {
    if (this.localStorageSupported) {
      try {
        const itemStr = localStorage.getItem(key);
        return itemStr ? JSON.parse(itemStr) : null;
      } catch (err) {
        return localStorage.getItem(key);
      }
    } else {
      return null;
    }
  }

  // remove value from storage
  remove(key: string): void {
    if (this.localStorageSupported) {
      localStorage.removeItem(key);
    }
  }

  // clear storage (remove all items from it)
  clear() {
    if (this.localStorageSupported) {
      localStorage.clear();
    }
  }
}
