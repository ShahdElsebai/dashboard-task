import { Injectable } from '@angular/core';
import { LocalStorageKeys } from '../models/core.model';

@Injectable({
  providedIn: 'root'
})
export class DataLocalStorageService {

  setItemInLocalStorage(key: LocalStorageKeys, value: string) {
    localStorage.setItem(key, value);
  }
  getItemFromLocalStorage(key: LocalStorageKeys): string | null {
    const item = localStorage.getItem(key);
    return item ? item : null;
  }
  removeItemFromLocalStorage(key: LocalStorageKeys) {
    localStorage.removeItem(key);
  }
  clearLocalStorage() {
    localStorage.clear();
  }
}
