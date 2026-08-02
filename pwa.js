(() => {
  'use strict';

  const BASE = '/SiteMinadental/';
  const LOCATION_TEXT = 'استان تهران، تهران، منطقه ۲۱، بلوار گل‌ها';
  const MAP_URL = 'https://maps.app.goo.gl/UQE1itDfMgwCGxMu5?g_st=ic';
  let deferredInstallPrompt = null;
  let installAttempted = false;
  let refreshing = false;

  const isStandalone = () =>
    window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

  const repairLocation = () => {
    document.querySelectorAll('a[href]').forEach(anchor => {
      const href = anchor.getAttribute('href') || '';
      const label = (anchor.textContent || '').trim();
      if (/google.*maps|maps\.google|maps\.app\.goo\.gl|neshan|balad|waze/i.test(href) || /مسیریابی|نقشه|لوکیشن|آدرس/i.test(label)) {
        anchor.href = MAP_URL;
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
      }
    });

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (!node.nodeValue || !/امیرکبیر|گلها|گل‌ها|منطقه\s*(۲۲|22)|P6XX\+G5J/.test(node.nodeValue)) continue;
      node.nodeValue = node.nodeValue
        .replace(/خیابان امیرکبیر،\s*گلها،\s*نبش یاس/g, LOCATION_TEXT)
        .replace(/استان تهران،\s*تهران،\s*منطقه ۲۱،\s*بلوار گل‌ها،\s*P6XX\+G5J/g, LOCATION_TEXT)
        .replace(/بلوار گل‌ها،\s*Plus Code:\s*P6XX\+G5J/g, LOCATION_TEXT)
        .replace(/منطقه\s*۲۲/g, 'منطقه ۲۱')
        .replace(/منطقه\s*22/g, 'منطقه ۲۱');
    }
  };

  const observer = new MutationObserver(repairLocation);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener('DOMContentLoaded', repairLocation, { once: true });
  window.addEventListener('load', repairLocation, { once: true });

  const requestInstall = async () => {
    if (!deferredInstallPrompt || installAttempted || isStandalone()) return false;
    installAttempted = true;
    const promptEvent = deferredInstallPrompt;
    deferredInstallPrompt = null;
    try {
      await promptEvent.prompt();
      const choice = await promptEvent.userChoice;
      window.dispatchEvent(new CustomEvent('mina:pwa-install-result', { detail: choice }));
      return choice?.outcome === 'accepted';
    } catch (error) {
      installAttempted = false;
      deferredInstallPrompt = promptEvent;
      console.warn('PWA install prompt was not completed.', error);
      return false;
    }
  };

  const armNextInteraction = () => {
    const trigger = () => requestInstall();
    window.addEventListener('pointerup', trigger, { once: true, passive: true, capture: true });
    window.addEventListener('keydown', trigger, { once: true, capture: true });
  };

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredInstallPrompt = event;
    window.dispatchEvent(new CustomEvent('mina:pwa-install-ready'));
    requestInstall().then(accepted => {
      if (!accepted && deferredInstallPrompt) armNextInteraction();
    });
  });

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    installAttempted = true;
    window.dispatchEvent(new CustomEvent('mina:pwa-installed'));
  });

  window.minaDentalInstall = requestInstall;

  if (!('serviceWorker' in navigator)) return;

  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register(`${BASE}sw.js`, {
        scope: BASE,
        updateViaCache: 'none'
      });
      const activateWaitingWorker = worker => worker?.postMessage({ type: 'SKIP_WAITING' });
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
      window.setInterval(checkForUpdate, 15 * 60 * 1000);
      window.addEventListener('online', checkForUpdate);
      window.addEventListener('pageshow', checkForUpdate);
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
