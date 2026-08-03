(() => {
  'use strict';

  const DISMISS_KEY = 'mina_install_prompt_dismissed_at';
  const COMPLETE_KEY = 'mina_install_guide_completed';
  const isStandalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isSafari = isIOS && /safari/i.test(navigator.userAgent) && !/crios|fxios|edgios/i.test(navigator.userAgent);
  let config = null;

  async function loadConfig() {
    try {
      const response = await fetch(`./clinic-config.json?v=${Date.now()}`, { cache: 'no-store' });
      if (response.ok) config = await response.json();
    } catch (error) {
      window.minaDental?.emit?.('install_config_error', { message: error?.message || 'unknown' });
    }
  }

  function ensureStyles() {
    if (document.getElementById('mina-install-premium-style')) return;
    const style = document.createElement('style');
    style.id = 'mina-install-premium-style';
    style.textContent = `
      .mina-install-backdrop{position:fixed;inset:0;z-index:2147483000;background:rgba(2,15,23,.58);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);display:flex;align-items:flex-end;justify-content:center;padding:max(16px,env(safe-area-inset-top)) 14px max(16px,env(safe-area-inset-bottom));opacity:0;transition:opacity .28s ease}
      .mina-install-backdrop[data-show="1"]{opacity:1}
      .mina-install-modal{width:min(100%,520px);max-height:min(92vh,780px);overflow:auto;background:linear-gradient(180deg,#ffffff 0%,#f7fffe 100%);border:1px solid rgba(13,148,136,.18);border-radius:30px;box-shadow:0 30px 90px rgba(2,15,23,.35);direction:rtl;transform:translateY(26px) scale(.98);transition:transform .32s cubic-bezier(.2,.8,.2,1);color:#0f172a;position:relative}
      .mina-install-backdrop[data-show="1"] .mina-install-modal{transform:translateY(0) scale(1)}
      .mina-install-close{position:absolute;left:16px;top:16px;width:40px;height:40px;border:0;border-radius:50%;background:#f1f5f9;color:#334155;font-size:22px;display:grid;place-items:center;z-index:2}
      .mina-install-hero{padding:30px 24px 20px;text-align:center;background:radial-gradient(circle at 50% -10%,rgba(45,212,191,.28),transparent 55%)}
      .mina-install-logo{width:96px;height:96px;border-radius:25px;object-fit:cover;box-shadow:0 18px 38px rgba(13,148,136,.25);margin:2px auto 16px;display:block}
      .mina-install-badge{display:inline-flex;align-items:center;gap:7px;padding:7px 12px;border-radius:999px;background:#ecfdf5;color:#047857;font-size:12px;font-weight:900;margin-bottom:12px}
      .mina-install-title{font-size:24px;line-height:1.55;font-weight:950;margin:0 0 8px;color:#0f172a}
      .mina-install-description{font-size:14px;line-height:2;color:#475569;margin:0 auto;max-width:390px}
      .mina-install-benefits{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:0 18px 18px}
      .mina-install-benefit{background:#fff;border:1px solid #e2e8f0;border-radius:18px;padding:13px 8px;text-align:center;font-size:11px;line-height:1.7;font-weight:800;color:#334155}
      .mina-install-benefit span{display:block;font-size:21px;margin-bottom:4px}
      .mina-install-discount{margin:0 18px 18px;padding:15px 16px;border-radius:20px;background:linear-gradient(135deg,#0f766e,#0d9488);color:#fff;box-shadow:0 14px 30px rgba(13,148,136,.22)}
      .mina-install-discount strong{display:block;font-size:16px;margin-bottom:5px}.mina-install-discount p{margin:0;font-size:12px;line-height:1.9;opacity:.95}
      .mina-ios-steps{padding:0 18px 10px}.mina-ios-steps-title{font-size:15px;font-weight:950;margin:0 0 12px}.mina-ios-step{display:flex;align-items:center;gap:12px;background:#fff;border:1px solid #e2e8f0;border-radius:18px;padding:12px;margin-bottom:9px}.mina-ios-step-num{flex:0 0 34px;width:34px;height:34px;border-radius:12px;background:#0d9488;color:#fff;display:grid;place-items:center;font-weight:950}.mina-ios-step-icon{font-size:24px;flex:0 0 28px;text-align:center}.mina-ios-step-text{font-size:13px;line-height:1.8;color:#334155}.mina-ios-step-text b{color:#0f172a}
      .mina-install-actions{padding:10px 18px 20px;display:grid;gap:9px}.mina-install-primary{width:100%;border:0;border-radius:17px;background:linear-gradient(135deg,#0d9488,#0f766e);color:#fff;padding:15px 18px;font-size:15px;font-weight:950;box-shadow:0 14px 30px rgba(13,148,136,.24)}.mina-install-secondary{width:100%;border:1px solid #cbd5e1;border-radius:17px;background:#fff;color:#475569;padding:13px 18px;font-size:13px;font-weight:850}
      .mina-install-note{padding:0 22px 22px;text-align:center;color:#64748b;font-size:11px;line-height:1.9}
      @media(min-width:640px){.mina-install-backdrop{align-items:center}.mina-install-modal{border-radius:32px}}
      @media(max-width:360px){.mina-install-title{font-size:21px}.mina-install-benefits{grid-template-columns:1fr}.mina-install-benefit{display:flex;align-items:center;gap:8px;text-align:right}.mina-install-benefit span{margin:0}}
      @media(prefers-reduced-motion:reduce){.mina-install-backdrop,.mina-install-modal{transition:none}}
    `;
    document.head.appendChild(style);
  }

  function recentDismissal() {
    const dismissedAt = Number(localStorage.getItem(DISMISS_KEY) || 0);
    return dismissedAt && Date.now() - dismissedAt < 24 * 60 * 60 * 1000;
  }

  function closeModal(modal, remember = false) {
    modal.dataset.show = '0';
    if (remember) localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setTimeout(() => modal.remove(), 320);
  }

  function createInstallExperience() {
    if (isStandalone() || document.getElementById('mina-install-experience') || recentDismissal()) return;
    const promotion = config?.installPromotion || {};
    if (promotion.enabled === false) return;
    ensureStyles();

    const discountActive = Boolean(
      promotion.discountEnabled &&
      promotion.discountTitle &&
      (!promotion.discountExpiresAt || Date.parse(promotion.discountExpiresAt) > Date.now())
    );
    const discountHtml = discountActive
      ? `<section class="mina-install-discount"><strong>🎁 هدیه ویژه نصب برنامه</strong><p>${promotion.discountTitle}${promotion.discountCode ? ` — کد تخفیف: ${promotion.discountCode}` : ''}</p></section>`
      : `<section class="mina-install-discount"><strong>✨ مزایای اختصاصی کاربران برنامه</strong><p>دسترسی سریع‌تر به رزرو، یادآوری نوبت و اطلاع از پیشنهادهای فعال کلینیک؛ تخفیف‌ها فقط هنگام فعال‌شدن رسمی نمایش داده می‌شوند.</p></section>`;

    const iosGuide = isIOS ? `
      <section class="mina-ios-steps">
        <h3 class="mina-ios-steps-title">نصب در آیفون، کمتر از ۲۰ ثانیه</h3>
        <div class="mina-ios-step"><span class="mina-ios-step-num">۱</span><span class="mina-ios-step-icon">⇧</span><div class="mina-ios-step-text">پایین Safari روی دکمه <b>اشتراک‌گذاری</b> بزنید.</div></div>
        <div class="mina-ios-step"><span class="mina-ios-step-num">۲</span><span class="mina-ios-step-icon">＋</span><div class="mina-ios-step-text">گزینه <b>Add to Home Screen / افزودن به صفحه اصلی</b> را انتخاب کنید.</div></div>
        <div class="mina-ios-step"><span class="mina-ios-step-num">۳</span><span class="mina-ios-step-icon">✓</span><div class="mina-ios-step-text">بالای صفحه روی <b>Add / افزودن</b> بزنید تا لوگوی مینا دنتال روی گوشی قرار بگیرد.</div></div>
      </section>` : '';

    const modal = document.createElement('aside');
    modal.id = 'mina-install-experience';
    modal.className = 'mina-install-backdrop';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'mina-install-title');
    modal.innerHTML = `<div class="mina-install-modal">
      <button type="button" class="mina-install-close" aria-label="بستن">×</button>
      <section class="mina-install-hero">
        <img class="mina-install-logo" src="./apple-touch-icon-180.png?v=2026080313" alt="لوگوی مینا دنتال">
        <span class="mina-install-badge">● نصب امن و مستقیم از مرورگر</span>
        <h2 id="mina-install-title" class="mina-install-title">مینا دنتال را همیشه یک لمس با خودتان داشته باشید</h2>
        <p class="mina-install-description">بدون جست‌وجوی دوباره در اینترنت؛ رزرو نوبت، مسیر مطب، یادآوری‌ها و پیشنهادهای فعال کلینیک را سریع و مستقیم باز کنید.</p>
      </section>
      <section class="mina-install-benefits">
        <div class="mina-install-benefit"><span>📅</span>رزرو سریع نوبت</div>
        <div class="mina-install-benefit"><span>🔔</span>یادآوری و اطلاعیه</div>
        <div class="mina-install-benefit"><span>🎁</span>پیشنهادهای ویژه</div>
      </section>
      ${discountHtml}
      ${iosGuide}
      <div class="mina-install-actions">
        <button type="button" class="mina-install-primary">${isIOS ? (isSafari ? 'متوجه شدم؛ راهنمای نصب را انجام می‌دهم' : 'باز کردن در Safari برای نصب') : 'نصب برنامه روی گوشی'}</button>
        <button type="button" class="mina-install-secondary">فعلاً بعداً یادآوری کن</button>
      </div>
      <p class="mina-install-note">نصب برنامه رایگان است. ارسال اعلان فقط با اجازه خود شما انجام می‌شود و در هر زمان قابل غیرفعال‌سازی است.</p>
    </div>`;

    document.body.appendChild(modal);
    requestAnimationFrame(() => modal.dataset.show = '1');
    modal.querySelector('.mina-install-close').addEventListener('click', () => closeModal(modal, true));
    modal.querySelector('.mina-install-secondary').addEventListener('click', () => closeModal(modal, true));
    modal.addEventListener('click', event => { if (event.target === modal) closeModal(modal, true); });

    modal.querySelector('.mina-install-primary').addEventListener('click', async () => {
      window.minaDental?.emit?.('install_guide_primary_click', { platform: isIOS ? 'ios' : 'other', safari: isSafari, discountActive });
      if (isIOS) {
        if (!isSafari) {
          alert('برای نصب روی آیفون، این صفحه را در Safari باز کنید و سپس از منوی اشتراک‌گذاری گزینه افزودن به صفحه اصلی را بزنید.');
          return;
        }
        localStorage.setItem(COMPLETE_KEY, 'guide-viewed');
        modal.querySelector('.mina-ios-steps')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      if (typeof window.minaDentalInstall === 'function') {
        const accepted = await window.minaDentalInstall();
        if (accepted) closeModal(modal, false);
      }
    });
  }

  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const raw = atob(base64);
    return Uint8Array.from([...raw].map(ch => ch.charCodeAt(0)));
  }

  async function subscribePush() {
    const pushConfig = config?.notifications || {};
    if (!pushConfig.enabled || !pushConfig.publicVapidKey || !pushConfig.subscriptionEndpoint) return { ok: false, reason: 'backend_not_configured' };
    const registration = await navigator.serviceWorker.ready;
    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) subscription = await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(pushConfig.publicVapidKey) });
    const response = await fetch(pushConfig.subscriptionEndpoint, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
      body: JSON.stringify({ subscription: subscription.toJSON(), source: 'website-pwa', locale: 'fa-IR', installed: isStandalone() })
    });
    if (!response.ok) throw new Error(`Push subscription HTTP ${response.status}`);
    return { ok: true };
  }

  async function requestNotifications() {
    if (!isStandalone() || !('Notification' in window) || Notification.permission !== 'default') return;
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return;
    try { await subscribePush(); } catch (error) { window.minaDental?.emit?.('push_subscription_error', { message: error?.message || 'unknown' }); }
  }

  async function init() {
    await loadConfig();
    if (!isStandalone()) setTimeout(createInstallExperience, 900);
    else setTimeout(requestNotifications, 2200);
  }

  window.addEventListener('mina:pwa-install-ready', createInstallExperience);
  window.addEventListener('mina:pwa-installed', () => document.getElementById('mina-install-experience')?.remove());
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true }); else init();
})();
