import { registerSW } from 'virtual:pwa-register';
import { isNativeShell } from './lib/platform';

export function setupPwa() {
  if (!('serviceWorker' in navigator)) return;

  // 原生壳已经自带离线资源，注册 Service Worker 反而可能在升级后命中旧缓存。
  if (isNativeShell()) {
    void navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => {
        void registration.unregister();
      });
    });
    if ('caches' in window) {
      void caches.keys().then((keys) => {
        keys.forEach((key) => {
          void caches.delete(key);
        });
      });
    }
    return;
  }

  registerSW({ immediate: true });
}
