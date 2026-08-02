(() => {
  'use strict';

  const BASE = '/SiteMinadental/';
  const LOCATION_TEXT = 'تهران، منطقه ۲۱، بلوار گل‌ها، محدوده یاس اول';
  const PLACE_QUERY = 'دندانپزشکی تخصصی صدف، بلوار گل‌ها، یاس اول، تهران';
  const MAP_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(PLACE_QUERY)}`;
  const MAP_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(PLACE_QUERY)}&output=embed&hl=fa`;
  let deferredInstallPrompt = null;
  let installAttempted = false;
  let refreshing = false;

  const isStandalone = () =>
    window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

  const repairLocation = () => {
    document.querySelectorAll('a[href]').forEach(anchor => {
      const href = anchor.getAttribute('href') || '';
      const label = (anchor.textContent || '').trim();
      if (/google.*maps|maps\.google|maps\.app\.goo\.gl/i.test(href) || /گوگل\s*مپ|لوکیشن|موقعیت|مسیریابی|باز کردن در Maps/i.test(label)) {
        anchor.href = MAP_URL;
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
        anchor.setAttribute('aria-label', 'مشاهده موقعیت دقیق دندانپزشکی تخصصی صدف در گوگل مپ');
      }
    });

    document.querySelectorAll('iframe').forEach(frame => {
      const src = frame.getAttribute('src') || '';
      const title = frame.getAttribute('title') || '';
      if (/google.*maps|maps\.google|map/i.test(src) || /نقشه|map/i.test(title)) {
        if (frame.src !== MAP_EMBED_URL) frame.src = MAP_EMBED_URL;
        frame.title = 'موقعیت دقیق دندانپزشکی تخصصی صدف، بلوار گل‌ها، یاس اول';
        frame.loading = 'lazy';
        frame.referrerPolicy = 'no-referrer-when-downgrade';
      }
    });

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (!node.nodeValue || !/امیرکبیر|گلها|گل‌ها|منطقه\s*(۲۲|22)|P6XX\+G5J|چیتگر شمالی/.test(node.nodeValue)) continue;
      node.nodeValue = node.nodeValue
        .replace(/خیابان امیرکبیر،\s*گلها،\s*نبش یاس/g, LOCATION_TEXT)
        .replace(/استان تهران،\s*تهران،\s*منطقه ۲۱،\s*بلوار گل‌ها،\s*P6XX\+G5J/g, LOCATION_TEXT)
        .replace(/بلوار گل‌ها،\s*Plus Code:\s*P6XX\+G5J/g, LOCATION_TEXT)
        .replace(/چیتگر(?:-e)?\s*شمالی/gi, 'بلوار گل‌ها، یاس اول')
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
