(() => {
  'use strict';

  const scriptUrl = document.currentScript?.src || new URL('./pwa-runtime.js', location.href).href;
  const baseUrl = new URL('./', scriptUrl);
  const basePath = baseUrl.pathname;
  const APP_VERSION = document.querySelector('meta[name="app-version"]')?.content || '2026.08.05.1';
  const UPDATE_INTERVAL_MS = 30 * 60 * 1000;
  const FORM_STATE_KEY = 'mina-pwa-form-state-v2';

  let deferredInstallPrompt = null;
  let registration = null;
  let updateTimer = null;
  let reloadingForUpdate = false;
  const hadControllerAtLoad = Boolean(navigator.serviceWorker?.controller);

  const isStandalone = () =>
    window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

  // Privacy rule: only fields explicitly marked data-pwa-preserve="true" may be
  // kept during an automatic service-worker refresh. Patient/medical form fields
  // are never persisted implicitly.
  const persistOptInFormState = () => {
    try {
      const fields = [...document.querySelectorAll('[data-pwa-preserve="true"]')]
        .filter((field) => field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement)
        .filter((field) => field.name || field.id)
        .map((field) => ({
          key: field.name || field.id,
          value: /^(checkbox|radio)$/.test(field.type) ? field.checked : field.value,
          kind: /^(checkbox|radio)$/.test(field.type) ? 'checked' : 'value'
        }));
      if (fields.length) sessionStorage.setItem(FORM_STATE_KEY, JSON.stringify(fields));
      else sessionStorage.removeItem(FORM_STATE_KEY);
    } catch {}
  };

  const restoreOptInFormState = () => {
    try {
      const raw = sessionStorage.getItem(FORM_STATE_KEY);
      if (!raw) return;
      sessionStorage.removeItem(FORM_STATE_KEY);
      for (const item of JSON.parse(raw)) {
        const escaped = window.CSS?.escape ? CSS.escape(item.key) : item.key.replace(/["\\]/g, '\\$&');
        const field = document.querySelector(`[data-pwa-preserve="true"][name="${escaped}"], [data-pwa-preserve="true"]#${escaped}`);
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
      const versionUrl = new URL(`version.json?ts=${Date.now()}`, baseUrl);
      const response = await fetch(versionUrl, { cache: 'no-store', credentials: 'same-origin' });
      const remote = response.ok ? await response.json() : null;
      if (!remote?.version || remote.version !== APP_VERSION) await registration.update();
    } catch {
      try { await registration.update(); } catch {}
    }
    activateWaitingWorker();
  };

  const scheduleUpdateChecks = () => {
    clearInterval(updateTimer);
    updateTimer = setInterval(checkForUpdate, UPDATE_INTERVAL_MS);
    window.addEventListener('online', checkForUpdate);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') checkForUpdate();
    });
  };

  const registerServiceWorker = async () => {
    if (!('serviceWorker' in navigator) || !window.isSecureContext) return;
    try {
      const swUrl = new URL('sw.js', baseUrl);
      registration = await navigator.serviceWorker.register(swUrl.pathname, {
        scope: basePath,
        updateViaCache: 'none'
      });
      watchInstallingWorker(registration.installing);
      registration.addEventListener('updatefound', () => watchInstallingWorker(registration.installing));
      activateWaitingWorker();
      scheduleUpdateChecks();
      checkForUpdate();
    } catch (error) {
      console.warn('PWA service worker registration failed.', error);
    }
  };

  // Install is user-driven. We expose a small public API/event instead of
  // interrupting the first click/keypress with an automatic browser prompt.
  const pwaApi = {
    canInstall: () => Boolean(deferredInstallPrompt) && !isStandalone(),
    install: async () => {
      const promptEvent = deferredInstallPrompt;
      if (!promptEvent || isStandalone()) return { outcome: 'unavailable' };
      deferredInstallPrompt = null;
      await promptEvent.prompt();
      try { return await promptEvent.userChoice; }
      catch { return { outcome: 'unknown' }; }
    }
  };
  Object.defineProperty(window, 'MinaPWA', { value: pwaApi, configurable: false, writable: false });

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    window.dispatchEvent(new CustomEvent('mina:pwa-install-available'));
  });

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    window.dispatchEvent(new CustomEvent('mina:pwa-installed'));
  });

  navigator.serviceWorker?.addEventListener('controllerchange', () => {
    if (!hadControllerAtLoad || reloadingForUpdate) return;
    reloadingForUpdate = true;
    persistOptInFormState();
    location.reload();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', restoreOptInFormState, { once: true });
  } else {
    restoreOptInFormState();
  }

  window.addEventListener('load', registerServiceWorker, { once: true });
})();
