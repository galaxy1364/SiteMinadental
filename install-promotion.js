(() => {
  'use strict';

  const isStandalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  let config = null;

  async function loadConfig() {
    try {
      const response = await fetch(`./clinic-config.json?v=${Date.now()}`, { cache: 'no-store' });
      if (response.ok) config = await response.json();
    } catch {}
  }

  function createBanner() {
    if (isStandalone() || document.getElementById('mina-install-offer')) return;
    const promotion = config?.installPromotion || {};
    if (promotion.enabled === false) return;
    const banner = document.createElement('aside');
    banner.id = 'mina-install-offer';
    banner.className = 'mina-install-offer';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'نصب برنامه مینا دنتال');
    const discount = promotion.discountEnabled && promotion.discountTitle
      ? `<p><b>${promotion.discountTitle}</b>${promotion.discountCode ? ` — کد: ${promotion.discountCode}` : ''}</p>` : '';
    const iosHelp = isIOS ? '<p class="mina-ios-help">در آیفون: دکمه اشتراک‌گذاری Safari را بزنید و «افزودن به صفحه اصلی» را انتخاب کنید.</p>' : '';
    banner.innerHTML = `<strong>${promotion.title || 'مینا دنتال را روی گوشی نصب کنید'}</strong>
      <p>${promotion.description || 'دسترسی سریع به رزرو نوبت، یادآوری‌ها و پیشنهادهای فعال کلینیک'}</p>
      ${discount}${iosHelp}
      <div class="mina-install-actions">
        <button type="button" class="mina-install-primary">${isIOS ? 'راهنمای نصب در آیفون' : 'نصب برنامه'}</button>
        <button type="button" class="mina-install-later">بعداً</button>
      </div>`;
    document.body.appendChild(banner);
    requestAnimationFrame(() => banner.dataset.show = '1');

    banner.querySelector('.mina-install-primary').addEventListener('click', async () => {
      if (isIOS) {
        banner.querySelector('.mina-ios-help')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      if (typeof window.minaDentalInstall === 'function') {
        const accepted = await window.minaDentalInstall();
        if (accepted) banner.dataset.show = '0';
      }
    });
    banner.querySelector('.mina-install-later').addEventListener('click', () => {
      banner.dataset.show = '0';
      sessionStorage.setItem('mina_install_later', '1');
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
    if (!pushConfig.enabled || !pushConfig.publicVapidKey || !pushConfig.subscriptionEndpoint) {
      return { ok: false, reason: 'backend_not_configured' };
    }
    const registration = await navigator.serviceWorker.ready;
    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(pushConfig.publicVapidKey)
      });
    }
    const response = await fetch(pushConfig.subscriptionEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        subscription: subscription.toJSON(),
        source: 'website-pwa',
        locale: 'fa-IR',
        installed: isStandalone()
      })
    });
    if (!response.ok) throw new Error(`Push subscription HTTP ${response.status}`);
    return { ok: true };
  }

  async function requestNotifications() {
    if (!isStandalone() || !('Notification' in window) || Notification.permission !== 'default') return;
    const notice = document.createElement('aside');
    notice.id = 'mina-notification-offer';
    notice.className = 'mina-install-offer';
    notice.dataset.show = '1';
    notice.innerHTML = `<strong>اعلان نوبت و تخفیف‌ها را فعال کنید</strong><p>فقط اطلاعیه‌های فعال کلینیک و یادآوری‌های ضروری برای شما ارسال می‌شود.</p><div class="mina-install-actions"><button type="button" class="mina-install-primary">فعال‌سازی اعلان</button><button type="button" class="mina-install-later">فعلاً نه</button></div>`;
    document.body.appendChild(notice);
    notice.querySelector('.mina-install-primary').addEventListener('click', async () => {
      const permission = await Notification.requestPermission();
      let push = { ok: false, reason: 'permission_denied' };
      if (permission === 'granted') {
        try { push = await subscribePush(); }
        catch (error) { push = { ok: false, reason: 'subscription_failed', message: error.message }; }
      }
      window.minaDental?.emit?.('notification_permission_result', { permission, push });
      notice.remove();
    });
    notice.querySelector('.mina-install-later').addEventListener('click', () => notice.remove());
  }

  async function init() {
    await loadConfig();
    if (!isStandalone() && sessionStorage.getItem('mina_install_later') !== '1') {
      setTimeout(createBanner, 1200);
    } else if (isStandalone()) {
      setTimeout(requestNotifications, 1800);
    }
  }

  window.addEventListener('mina:pwa-install-ready', createBanner);
  window.addEventListener('mina:pwa-installed', () => document.getElementById('mina-install-offer')?.remove());
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true }); else init();
})();
