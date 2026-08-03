(() => {
  'use strict';

  const STYLE_ID = 'mina-update-manager-style';
  const POPUP_ID = 'mina-update-popup';
  const CHECK_INTERVAL_MS = 15 * 60 * 1000;
  let refreshing = false;

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .mina-update-popup{position:fixed;inset:auto 14px max(14px,env(safe-area-inset-bottom));z-index:2147482500;margin:auto;max-width:520px;direction:rtl;background:rgba(255,255,255,.97);border:1px solid rgba(13,148,136,.22);border-radius:24px;box-shadow:0 24px 70px rgba(15,23,42,.28);padding:18px;transform:translateY(140%);opacity:0;transition:.3s cubic-bezier(.2,.8,.2,1);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px)}
      .mina-update-popup[data-show="1"]{transform:translateY(0);opacity:1}.mina-update-row{display:flex;gap:13px;align-items:flex-start}.mina-update-icon{width:48px;height:48px;border-radius:16px;display:grid;place-items:center;background:#ccfbf1;color:#0f766e;font-size:23px;flex:0 0 auto}.mina-update-copy{flex:1}.mina-update-title{font-size:16px;font-weight:950;margin:0 0 5px;color:#0f172a}.mina-update-text{font-size:12px;line-height:1.9;color:#475569;margin:0}.mina-update-actions{display:grid;grid-template-columns:1fr auto;gap:9px;margin-top:14px}.mina-update-primary,.mina-update-later{border:0;border-radius:14px;padding:12px 14px;font-weight:900}.mina-update-primary{background:#0d9488;color:#fff}.mina-update-later{background:#f1f5f9;color:#475569}.mina-update-progress{height:4px;background:#e2e8f0;border-radius:99px;overflow:hidden;margin-top:13px;display:none}.mina-update-progress span{display:block;height:100%;width:45%;background:#0d9488;border-radius:99px;animation:mina-update-progress 1.1s infinite ease-in-out}@keyframes mina-update-progress{from{transform:translateX(130%)}to{transform:translateX(-230%)}}
    `;
    document.head.appendChild(style);
  }

  function showPopup(registration) {
    if (!registration?.waiting || document.getElementById(POPUP_ID)) return;
    ensureStyle();
    const popup = document.createElement('aside');
    popup.id = POPUP_ID;
    popup.className = 'mina-update-popup';
    popup.setAttribute('role', 'dialog');
    popup.setAttribute('aria-live', 'polite');
    popup.innerHTML = `<div class="mina-update-row"><div class="mina-update-icon">↻</div><div class="mina-update-copy"><h2 class="mina-update-title">نسخه جدید مینا دنتال آماده است</h2><p class="mina-update-text">بهبودهای جدید سایت، رزرو و امنیت دریافت شده‌اند. برای فعال‌شدن کامل، برنامه یک‌بار تازه‌سازی می‌شود.</p></div></div><div class="mina-update-progress"><span></span></div><div class="mina-update-actions"><button type="button" class="mina-update-primary">بروزرسانی و ادامه</button><button type="button" class="mina-update-later">بعداً</button></div>`;
    document.body.appendChild(popup);
    requestAnimationFrame(() => popup.dataset.show = '1');

    popup.querySelector('.mina-update-primary').addEventListener('click', () => {
      popup.querySelector('.mina-update-progress').style.display = 'block';
      popup.querySelector('.mina-update-primary').disabled = true;
      popup.querySelector('.mina-update-primary').textContent = 'در حال بروزرسانی…';
      window.minaDental?.emit?.('pwa_update_accept');
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    });
    popup.querySelector('.mina-update-later').addEventListener('click', () => {
      window.minaDental?.emit?.('pwa_update_defer');
      popup.dataset.show = '0';
      setTimeout(() => popup.remove(), 320);
    });
  }

  async function inspectRegistration() {
    if (!('serviceWorker' in navigator)) return;
    const registration = await navigator.serviceWorker.getRegistration('/SiteMinadental/');
    if (!registration) return;
    if (registration.waiting) showPopup(registration);
    registration.addEventListener('updatefound', () => {
      const worker = registration.installing;
      worker?.addEventListener('statechange', () => {
        if (worker.state === 'installed' && navigator.serviceWorker.controller) showPopup(registration);
      });
    });
    await registration.update().catch(() => {});
  }

  navigator.serviceWorker?.addEventListener('controllerchange', () => {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });

  window.addEventListener('load', () => {
    inspectRegistration().catch(error => window.minaDental?.emit?.('pwa_update_check_error', { message: String(error?.message || error) }));
    setInterval(() => inspectRegistration().catch(() => {}), CHECK_INTERVAL_MS);
  }, { once: true });
  window.addEventListener('online', () => inspectRegistration().catch(() => {}));
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') inspectRegistration().catch(() => {});
  });
})();
