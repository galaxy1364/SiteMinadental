(() => {
  'use strict';
  const APP_VERSION = '2026.08.05.1';
  const BASE = '/SiteMinadental/';
  const UPDATE_INTERVAL_MS = 30 * 60 * 1000;
  const INSTALL_COOLDOWN_MS = 24 * 60 * 60 * 1000;
  const INSTALL_DISMISSED_AT = 'mina-pwa-install-dismissed-at';
  const FORM_STATE_KEY = 'mina-pwa-form-state';
  let deferredInstallPrompt = null;
  let registration = null;
  let updateTimer = null;
  let reloadingForUpdate = false;
  const hadControllerAtLoad = Boolean(navigator.serviceWorker?.controller);
  const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  const persistFormState = () => {
    try {
      const fields = [...document.querySelectorAll('input, select, textarea')]
        .filter((field) => field.name || field.id)
        .map((field) => ({
          key: field.name || field.id,
          value: /^(checkbox|radio)$/.test(field.type) ? field.checked : field.value,
          kind: /^(checkbox|radio)$/.test(field.type) ? 'checked' : 'value'
        }));
      sessionStorage.setItem(FORM_STATE_KEY, JSON.stringify(fields));
    } catch {}
  };
  const restoreFormState = () => {
    try {
      const raw = sessionStorage.getItem(FORM_STATE_KEY);
      if (!raw) return;
      sessionStorage.removeItem(FORM_STATE_KEY);
      for (const item of JSON.parse(raw)) {
        const escaped = window.CSS?.escape ? CSS.escape(item.key) : item.key.replace(/["\\]/g, '\\$&');
        const field = document.querySelector(`[name="${escaped}"], #${escaped}`);
        if (!field) continue;
        if (item.kind === 'checked') field.checked = Boolean(item.value);
        else field.value = item.value;
        field.dispatchEvent(new Event('input', { bubbles: true }));
        field.dispatchEvent(new Event('change', { bubbles: true }));
      }
    } catch {}
  };
  const activateWaitingWorker = () => registration?.waiting?.postMessage({ type: 'SKIP_WAITING' });
  const watchInstallingWorker = (worker) => worker?.addEventListener('statechange', () => {
    if (worker.state === 'installed' && navigator.serviceWorker.controller) activateWaitingWorker();
  });
  const checkForUpdate = async () => {
    if (!registration || !navigator.onLine) return;
    try {
      const response = await fetch(`${BASE}version.json?ts=${Date.now()}`, { cache: 'no-store' });
      const remote = response.ok ? await response.json() : null;
      if (!remote?.version || remote.version !== APP_VERSION) await registration.update();
    } catch { try { await registration.update(); } catch {} }
    activateWaitingWorker();
  };
  const scheduleUpdateChecks = () => {
    clearInterval(updateTimer);
    updateTimer = setInterval(checkForUpdate, UPDATE_INTERVAL_MS);
    window.addEventListener('online', checkForUpdate);
    document.addEventListener('visibilitychange', () => document.visibilityState === 'visible' && checkForUpdate());
  };
  const registerServiceWorker = async () => {
    if (!('serviceWorker' in navigator) || !window.isSecureContext) return;
    try {
      registration = await navigator.serviceWorker.register(`${BASE}sw.js`, { scope: BASE, updateViaCache: 'none' });
      watchInstallingWorker(registration.installing);
      registration.addEventListener('updatefound', () => watchInstallingWorker(registration.installing));
      activateWaitingWorker();
      scheduleUpdateChecks();
      checkForUpdate();
    } catch (error) { console.warn('PWA service worker registration failed.', error); }
  };
  const clearInstallListeners = (handler) => {
    window.removeEventListener('pointerup', handler, true);
    window.removeEventListener('keydown', handler, true);
  };
  const armAutomaticInstallPrompt = () => {
    if (!deferredInstallPrompt || isStandalone()) return;
    let dismissedAt = 0;
    try { dismissedAt = Number(localStorage.getItem(INSTALL_DISMISSED_AT) || 0); } catch {}
    if (Date.now() - dismissedAt < INSTALL_COOLDOWN_MS) return;
    const trigger = () => {
      clearInstallListeners(trigger);
      const promptEvent = deferredInstallPrompt;
      deferredInstallPrompt = null;
      if (!promptEvent) return;
      promptEvent.prompt();
      promptEvent.userChoice.then((choice) => {
        if (choice.outcome !== 'accepted') try { localStorage.setItem(INSTALL_DISMISSED_AT, String(Date.now())); } catch {}
      }).catch(() => {});
    };
    window.addEventListener('pointerup', trigger, { once: true, capture: true });
    window.addEventListener('keydown', trigger, { once: true, capture: true });
  };
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    armAutomaticInstallPrompt();
  });
  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    try { localStorage.removeItem(INSTALL_DISMISSED_AT); } catch {}
  });
  navigator.serviceWorker?.addEventListener('controllerchange', () => {
    if (!hadControllerAtLoad || reloadingForUpdate) return;
    reloadingForUpdate = true;
    persistFormState();
    location.reload();
  });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', restoreFormState, { once: true });
  else restoreFormState();
  window.addEventListener('load', registerServiceWorker, { once: true });
})();
