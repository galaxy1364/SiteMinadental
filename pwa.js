(() => {
  'use strict';

  const BASE = '/SiteMinadental/';
  const LOCATION_TEXT = 'استان تهران، تهران، منطقه ۲۱، بلوار گل‌ها، P6XX+G5J';
  const MAP_URL = 'https://www.google.com/maps/search/?api=1&query=P6XX%2BG5J%2C%20Tehran%2C%20Iran';
  let deferredInstallPrompt = null;
  let installRequested = false;
  let refreshing = false;

  const repairLocation = () => {
    document.querySelectorAll('a[href]').forEach(anchor => {
      const href = anchor.getAttribute('href') || '';
      const label = (anchor.textContent || '').trim();
      if (/google.*maps|maps\.google|neshan|balad|waze/i.test(href) || /مسیریابی|نقشه|لوکیشن|آدرس/i.test(label)) {
        anchor.href = MAP_URL;
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
      }
    });

    const replacements = [
      /خیابان امیرکبیر،\s*گلها،\s*نبش یاس/g,
      /منطقه\s*۲۲/g,
      /منطقه\s*22/g
    ];

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (!node.nodeValue || !/امیرکبیر|گلها|منطقه\s*(۲۲|22)/.test(node.nodeValue)) continue;
      let value = node.nodeValue;
      value = value.replace(replacements[0], LOCATION_TEXT);
      value = value.replace(replacements[1], 'منطقه ۲۱');
      value = value.replace(replacements[2], 'منطقه ۲۱');
      node.nodeValue = value;
    }
  };

  const observer = new MutationObserver(() => repairLocation());
  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener('DOMContentLoaded', repairLocation, { once: true });
  window.addEventListener('load', repairLocation, { once: true });

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
          if (worker.state === 'installed' && navigator.serviceWorker.controller) activateWaitingWorker(worker);
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
