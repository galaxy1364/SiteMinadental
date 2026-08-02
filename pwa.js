(() => {
  'use strict';

  const BASE = '/SiteMinadental/';
  let deferredInstallPrompt = null;
  let installRequested = false;
  let refreshing = false;

  const requestInstall = async () => {
    if (!deferredInstallPrompt || installRequested) return;
    installRequested = true;
    try {
      await deferredInstallPrompt.prompt();
      await deferredInstallPrompt.userChoice;
    } catch (error) {
      console.warn('PWA install prompt was not completed.', error);
    } finally {
      deferredInstallPrompt = null;
    }
  };

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredInstallPrompt = event;

    const firstInteraction = () => requestInstall();
    window.addEventListener('pointerup', firstInteraction, { once: true, passive: true });
    window.addEventListener('keydown', firstInteraction, { once: true });
  });

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
  });

  if (!('serviceWorker' in navigator)) return;

  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register(`${BASE}sw.js`, { scope: BASE });

      const activateWaitingWorker = worker => {
        if (worker) worker.postMessage({ type: 'SKIP_WAITING' });
      };

      if (registration.waiting) activateWaitingWorker(registration.waiting);

      registration.addEventListener('updatefound', () => {
        const worker = registration.installing;
        if (!worker) return;
        worker.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) {
            activateWaitingWorker(worker);
          }
        });
      });

      const checkForUpdate = () => registration.update().catch(() => {});
      checkForUpdate();
      window.setInterval(checkForUpdate, 30 * 60 * 1000);
      window.addEventListener('online', checkForUpdate);
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') checkForUpdate();
      });
    } catch (error) {
      console.error('Service Worker registration failed.', error);
    }
  });

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });
})();
