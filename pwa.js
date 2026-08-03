(() => {
  'use strict';

  const BASE = '/SiteMinadental/';
  const LOCATION_TEXT = 'تهران، منطقه ۲۱، بلوار گل‌ها، محدوده یاس اول';
  const PLACE_TITLE = 'دندانپزشکی تخصصی صدف — دکتر مینا مازندرانی';
  const OFFICIAL_MAP_URL = 'https://maps.app.goo.gl/giT47654NMPreoPt5?g_st=ic';
  let deferredInstallPrompt = null;
  let installAttempted = false;
  let refreshing = false;

  const isStandalone = () =>
    window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

  const ensureMapCardStyle = () => {
    if (document.getElementById('mina-exact-map-style')) return;
    const style = document.createElement('style');
    style.id = 'mina-exact-map-style';
    style.textContent = `
      .mina-exact-map-card{display:flex;min-height:320px;width:100%;align-items:center;justify-content:center;text-decoration:none;direction:rtl;border-radius:inherit;background:linear-gradient(135deg,#ecfeff 0%,#f0fdfa 48%,#eff6ff 100%);position:relative;overflow:hidden}
      .mina-exact-map-card:before{content:'';position:absolute;inset:0;background-image:radial-gradient(circle at 25% 25%,rgba(13,148,136,.12),transparent 28%),radial-gradient(circle at 78% 72%,rgba(37,99,235,.10),transparent 26%)}
      .mina-exact-map-card__content{position:relative;z-index:1;text-align:center;padding:28px 20px;color:#0f172a}
      .mina-exact-map-card__pin{width:74px;height:74px;border-radius:50%;display:grid;place-items:center;margin:0 auto 14px;background:#0d9488;color:#fff;font-size:36px;box-shadow:0 16px 36px rgba(13,148,136,.28)}
      .mina-exact-map-card__title{font-weight:900;font-size:18px;line-height:1.8;margin:0 0 6px}
      .mina-exact-map-card__address{font-size:13px;color:#475569;line-height:1.9;margin:0 0 14px}
      .mina-exact-map-card__cta{display:inline-flex;align-items:center;justify-content:center;border-radius:14px;background:#0d9488;color:#fff;padding:11px 18px;font-weight:800;font-size:13px}
    `;
    document.head.appendChild(style);
  };

  const replaceAmbiguousEmbeddedMap = frame => {
    if (frame.dataset.minaExactMapReplaced === '1') return;
    ensureMapCardStyle();
    const link = document.createElement('a');
    link.className = 'mina-exact-map-card';
    link.href = OFFICIAL_MAP_URL;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', `باز کردن موقعیت زنده و دقیق ${PLACE_TITLE} در گوگل مپ`);
    link.innerHTML = `<div class="mina-exact-map-card__content"><div class="mina-exact-map-card__pin">⌖</div><p class="mina-exact-map-card__title">${PLACE_TITLE}</p><p class="mina-exact-map-card__address">${LOCATION_TEXT}</p><span class="mina-exact-map-card__cta">باز کردن لوکیشن زنده و دقیق</span></div>`;
    const parent = frame.parentElement;
    if (parent) {
      const rect = frame.getBoundingClientRect();
      if (rect.height > 0) link.style.minHeight = `${Math.max(280, Math.round(rect.height))}px`;
      frame.dataset.minaExactMapReplaced = '1';
      frame.replaceWith(link);
    }
  };

  const repairLocation = () => {
    document.querySelectorAll('a[href]').forEach(anchor => {
      const href = anchor.getAttribute('href') || '';
      const label = (anchor.textContent || '').trim();
      if (/google.*maps|maps\.google|maps\.app\.goo\.gl|neshan|balad|waze/i.test(href) || /گوگل\s*مپ|لوکیشن|موقعیت|باز کردن در Maps|مسیریابی|نشان|بلد|ویز/i.test(label)) {
        anchor.href = OFFICIAL_MAP_URL;
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
        anchor.setAttribute('aria-label', `باز کردن موقعیت زنده و دقیق ${PLACE_TITLE} در گوگل مپ`);
      }
    });

    document.querySelectorAll('iframe').forEach(frame => {
      const src = frame.getAttribute('src') || '';
      const title = frame.getAttribute('title') || '';
      if (/google.*maps|maps\.google|maps\.app\.goo\.gl|map/i.test(src) || /نقشه|map/i.test(title)) {
        replaceAmbiguousEmbeddedMap(frame);
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
