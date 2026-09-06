(() => {
  'use strict';

  const STATUS_RUNTIME_VERSION = '1.0.0';
  const config = window.MINA_PUBLIC_CONFIG || null;

  const setState = (element, enabled, readyLabel = 'فعال و تأییدشده', blockedLabel = 'غیرفعال / نیازمند Evidence') => {
    if (!element) return;
    const state = Boolean(enabled);
    element.textContent = state ? readyLabel : blockedLabel;
    element.className = `tag ${state ? 'pass' : 'blocked'}`;
  };

  const setVerificationState = (element, enabled) => {
    if (!element) return;
    element.textContent = enabled ? 'تأییدشده' : 'در انتظار تأیید مالک';
    element.className = `tag ${enabled ? 'pass' : 'pending'}`;
  };

  const apply = () => {
    const root = document.querySelector('[data-status-root]');
    if (!root) return;
    root.dataset.statusRuntimeVersion = STATUS_RUNTIME_VERSION;

    if (!config) {
      root.querySelectorAll('[data-runtime-flag],[data-verification-flag]').forEach(el => {
        el.textContent = 'Config در دسترس نیست';
        el.className = 'tag blocked';
      });
      const source = document.querySelector('[data-config-source]');
      if (source) source.textContent = 'MINA_PUBLIC_CONFIG بارگذاری نشد';
      return;
    }

    root.querySelectorAll('[data-runtime-flag]').forEach(el => {
      const key = el.getAttribute('data-runtime-flag');
      setState(el, config.runtime?.[key]);
    });

    root.querySelectorAll('[data-verification-flag]').forEach(el => {
      const key = el.getAttribute('data-verification-flag');
      setVerificationState(el, config.verification?.[key]);
    });

    const updated = document.querySelector('[data-config-updated]');
    if (updated) updated.textContent = config.updatedAt || 'نامشخص';

    const target = document.querySelector('[data-production-target]');
    if (target) target.textContent = config.productionDomainTarget || 'نامشخص';

    const source = document.querySelector('[data-config-source]');
    if (source) source.textContent = 'وضعیت از MINA_PUBLIC_CONFIG خوانده شد';
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply, { once: true });
  } else {
    apply();
  }
})();
