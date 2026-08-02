(() => {
  'use strict';

  const isStandalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isSafari = /^((?!chrome|android|crios|fxios).)*safari/i.test(navigator.userAgent);
  let config = null;
  let installReady = false;

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

  async function requestNotifications() {
    if (!isStandalone() || !('Notification' in window) || Notification.permission !== 'default') return;
    const promotion = config?.installPromotion || {};
    const notice = document.createElement('aside');
    notice.id = 'mina-notification-offer';
    notice.className = 'mina-install-offer';
    notice.dataset.show = '1';
    notice.innerHTML = `<strong>اعلان نوبت و تخفیف‌ها را فعال کنید</strong><p>فقط اطلاعیه‌های فعال کلینیک و یادآوری‌های ضروری برای شما ارسال می‌شود.</p><div class="mina-install-actions"><button type="button" class="mina-install-primary">فعال‌سازی اعلان</button><button type="button" class="mina-install-later">فعلاً نه</button></div>`;
    document.body.appendChild(notice);
    notice.querySelector('.mina-install-primary').addEventListener('click', async () => {
      const permission = await Notification.requestPermission();
      window.minaDental?.emit?.('notification_permission_result', { permission });
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

  window.addEventListener('mina:pwa-install-ready', () => { installReady = true; createBanner(); });
  window.addEventListener('mina:pwa-installed', () => document.getElementById('mina-install-offer')?.remove());
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true }); else init();
})();
