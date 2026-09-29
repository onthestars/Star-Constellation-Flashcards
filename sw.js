// sw.js

const CACHE_NAME = "pwa-cache-v1";

// インストール時：即時更新
self.addEventListener("install", event => {
  self.skipWaiting();
});

// 有効化時：古いキャッシュを削除
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// ネット優先（Network First）
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // 新しいレスポンスをキャッシュに保存
        const cloned = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, cloned);
        });
        return response;
      })
      .catch(() => {
        // オフライン時はキャッシュを使う
        return caches.match(event.request);
      })
  );
});
