import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  private cache = new Map<string, any>();

  setCache(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  
  getCache(key: string) {
    return JSON.parse(localStorage.getItem(key) || 'null');
  }
  
  hasCache(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }
  
  clearCache() {
    localStorage.clear();
  }
  
}
