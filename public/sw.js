self.addEventListener('install', (_event) => {
  console.log('Service Worker installed.');
});

self.addEventListener('activate', (_event) => {
  console.log('Service Worker activated.');
});

self.addEventListener('fetch', (_event) => {
});
