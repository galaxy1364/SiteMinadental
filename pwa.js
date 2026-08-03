(() => {
  'use strict';

  const BASE = '/SiteMinadental/';
  const ICON_VERSION = '2026080314';
  const APPLE_ICON_URL = `${BASE}apple-touch-icon-v${ICON_VERSION}.png`;
  const LOCATION_TEXT = 'تهران، منطقه ۲۲، بلوار گل‌ها، محدوده یاس اول';
  const PLACE_TITLE = 'دندانپزشکی تخصصی صدف — دکتر مینا مازندرانی';
  const OFFICIAL_MAP_URL = 'https://maps.app.goo.gl/giT47654NMPreoPt5?g_st=ic';
  const MAP_LINK_PATTERN = /google.*maps|maps\.google|maps\.app\.goo\.gl|neshan|balad|waze/i;
  const MAP_LABEL_PATTERN = /گوگل\s*مپ|لوکیشن|موقعیت|باز کردن در Maps|مسیریابی|نشان|بلد|ویز/i;
  let deferredInstallPrompt = null;
  let repairScheduled = false;

  const isStandalone = () =>
    window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

  const ensureAppleInstallMetadata = () => {
    const setLink = (rel, href, sizes = '') => {
      let node = document.head.querySelector(`link[rel="${rel}"]`);
      if (!node) {
        node = document.createElement('link');
        node.rel = rel;
        document.head.appendChild(node);
      }
      node.href = href;
      if (sizes) node.sizes = sizes;
    };

    setLink('apple-touch-icon', APPLE_ICON_URL, '180x180');
    setLink('apple-touch-icon-precomposed', APPLE_ICON_URL, '180x180');
    setLink('shortcut icon', `${BASE}pwa-icon-192.png?v=${ICON_VERSION}`);

    let appleTitle = document.head.querySelector('meta[name="apple-mobile-web-app-title"]');
    if (!appleTitle) {
      appleTitle = document.createElement('meta');
      appleTitle.name = 'apple-mobile-web-app-title';
      document.head.appendChild(appleTitle);
    }
    appleTitle.content = 'مینا دنتال';
  };

  ensureAppleInstallMetadata();

  const ensureMapCardStyle = () => {
    if (document.getElementById('mina-exact-map-style')) return;
    const style = document.createElement('style');
    style.id = 'mina-exact-map-style';
    style.textContent = `
      .mina-exact-map-card{display:flex;min-height:320px;width:100%;align-items:center;justify-content:center;text-decoration:none;direction:rtl;border-radius:inherit;background:linear-gradient(135deg,rgba(183,201,168,.78) 0%,rgba(147,197,253,.55) 46%,rgba(167,139,250,.48) 100%);position:relative;overflow:hidden}
      .mina-exact-map-card:before{content:'';position:absolute;inset:0;background-image:radial-gradient(circle at 25% 25%,rgba(13,148,136,.18),transparent 28%),radial-gradient(circle at 78% 72%,rgba(249,168,212,.18),transparent 26%)}
      .mina-exact-map-card__content{position:relative;z-index:1;text-align:center;padding:28px 20px;color:#0f172a}
      .mina-exact-map-card__pin{width:74px;height:74px;border-radius:50%;display:grid;place-items:center;margin:0 auto 14px;background:#0d9488;color:#fff;font-size:36px;box-shadow:0 16px 36px rgba(13,148,136,.28)}
      .mina-exact-map-card__title{font-weight:900;font-size:18px;line-height:1.8;margin:0 0 6px}
      .mina-exact-map-card__address{font-size:13px;color:#334155;line-height:1.9;margin:0 0 14px}
      .mina-exact-map-card__cta{display:inline-flex;align-items:center;justify-content:center;border-radius:14px;background:#0d9488;color:#fff;padding:11px 18px;font-weight:800;font-size:13px}
    `;
    document.head.appendChild(style);
  };

  const replaceAmbiguousEmbeddedMap = frame => {
    if (!(frame instanceof HTMLIFrameElement) || frame.dataset.minaExactMapReplaced === '1') return;
    ensureMapCardStyle();
    const link = document.createElement('a');
    link.className = 'mina-exact-map-card';
    link.href = OFFICIAL_MAP_URL;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', `باز کردن موقعیت زنده و دقیق ${PLACE_TITLE} در گوگل مپ`);
    link.innerHTML = `<div class="mina-exact-map-card__content"><div class="mina-exact-map-card__pin" aria-hidden="true">⌖</div><p class="mina-exact-map-card__title">${PLACE_TITLE}</p><p class="mina-exact-map-card__address">${LOCATION_TEXT}</p><span class="mina-exact-map-card__cta">باز کردن لوکیشن زنده و دقیق</span></div>`;
    const rect = frame.getBoundingClientRect();
    if (rect.height > 0) link.style.minHeight = `${Math.max(280, Math.round(rect.height))}px`;
    frame.dataset.minaExactMapReplaced = '1';
    frame.replaceWith(link);
  };

  const repairAnchor = anchor => {
    if (!(anchor instanceof HTMLAnchorElement)) return;
    const href = anchor.getAttribute('href') || '';
    const label = (anchor.textContent || '').trim();
    if (!MAP_LINK_PATTERN.test(href) && !MAP_LABEL_PATTERN.test(label)) return;
    anchor.href = OFFICIAL_MAP_URL;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.setAttribute('aria-label', `باز کردن موقعیت زنده و دقیق ${PLACE_TITLE} در گوگل مپ`);
  };

  const repairTextNode = node => {
    if (!(node instanceof Text) || !node.nodeValue) return;
    if (!/امیرکبیر|گلها|گل‌ها|منطقه\s*(۲۱|21|۲۲|22)|P6XX\+G5J|چیتگر شمالی/.test(node.nodeValue)) return;
    node.nodeValue = node.nodeValue
      .replace(/خیابان امیرکبیر،\s*گلها،\s*نبش یاس/g, LOCATION_TEXT)
      .replace(/استان تهران،\s*تهران،\s*منطقه\s*(?:۲۱|21|۲۲|22)،\s*بلوار گل‌ها،\s*P6XX\+G5J/g, LOCATION_TEXT)
      .replace(/بلوار گل‌ها،\s*Plus Code:\s*P6XX\+G5J/g, LOCATION_TEXT)
      .replace(/چیتگر(?:-e)?\s*شمالی/gi, 'بلوار گل‌ها، یاس اول')
      .replace(/منطقه\s*۲۱/g, 'منطقه ۲۲')
      .replace(/منطقه\s*21/g, 'منطقه ۲۲');
  };

  const repairSubtree = root => {
    if (!(root instanceof Element) && root !== document) return;
    root.querySelectorAll?.('a[href]').forEach(repairAnchor);
    root.querySelectorAll?.('iframe').forEach(frame => {
      const src = frame.getAttribute('src') || '';
      const title = frame.getAttribute('title') || '';
      if (MAP_LINK_PATTERN.test(src) || /نقشه|map/i.test(title)) replaceAmbiguousEmbeddedMap(frame);
    });
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) repairTextNode(node);
  };

  const scheduleRepair = root => {
    if (repairScheduled) return;
    repairScheduled = true;
    requestAnimationFrame(() => {
      repairScheduled = false;
      repairSubtree(root || document);
    });
  };

  const observer = new MutationObserver(records => {
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (node instanceof Element) repairSubtree(node);
        else if (node instanceof Text) repairTextNode(node);
      }
    }
  });

  const startLocationRepair = () => {
    repairSubtree(document);
    observer.observe(document.body || document.documentElement, { childList: true, subtree: true });
  };

  const requestInstall = async () => {
    if (!deferredInstallPrompt || isStandalone()) return false;
    const promptEvent = deferredInstallPrompt;
    deferredInstallPrompt = null;
    try {
      await promptEvent.prompt();
      const choice = await promptEvent.userChoice;
      window.dispatchEvent(new CustomEvent('mina:pwa-install-result', { detail: choice }));
      return choice?.outcome === 'accepted';
    } catch (error) {
      deferredInstallPrompt = promptEvent;
      console.warn('PWA install prompt was not completed.', error);
      return false;
    }
  };

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredInstallPrompt = event;
    window.dispatchEvent(new CustomEvent('mina:pwa-install-ready'));
  });

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    window.dispatchEvent(new CustomEvent('mina:pwa-installed'));
  });

  window.minaDentalInstall = requestInstall;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startLocationRepair, { once: true });
  } else {
    startLocationRepair();
  }
  window.addEventListener('load', () => scheduleRepair(document), { once: true });

  if (!('serviceWorker' in navigator)) return;

  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register(`${BASE}sw.js`, {
        scope: BASE,
        updateViaCache: 'none'
      });
      const checkForUpdate = () => registration.update().catch(() => {});
      checkForUpdate();
      window.setInterval(checkForUpdate, 30 * 60 * 1000);
      window.addEventListener('online', checkForUpdate);
      window.addEventListener('pageshow', checkForUpdate);
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') checkForUpdate();
      });
    } catch (error) {
      console.error('Service Worker registration failed.', error);
      window.dispatchEvent(new CustomEvent('mina:runtime-error', { detail: { source: 'service-worker', message: String(error?.message || error) } }));
    }
  });
})();
