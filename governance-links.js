(() => {
  'use strict';

  const ensureGovernanceLinks = () => {
    if (document.querySelector('[data-mina-governance-links]')) return;

    const host = document.querySelector('footer') || document.body;
    if (!host) return;

    const nav = document.createElement('nav');
    nav.setAttribute('data-mina-governance-links', 'true');
    nav.setAttribute('data-mina-governance-version', '1');
    nav.setAttribute('aria-label', 'اطلاعات و سیاست‌های سایت');
    nav.style.cssText = [
      'display:flex',
      'flex-wrap:wrap',
      'align-items:center',
      'justify-content:center',
      'gap:10px',
      'margin:18px auto',
      'padding:12px 16px',
      'width:min(760px,calc(100% - 28px))',
      'border:1px solid rgba(13,148,136,.18)',
      'border-radius:18px',
      'background:rgba(255,255,255,.10)',
      'font-size:13px',
      'line-height:1.8'
    ].join(';');

    const makeLink = (href, label) => {
      const anchor = document.createElement('a');
      anchor.href = new URL(href, document.baseURI).href;
      anchor.textContent = label;
      anchor.style.cssText = [
        'display:inline-flex',
        'align-items:center',
        'justify-content:center',
        'min-height:44px',
        'padding:8px 14px',
        'border-radius:999px',
        'border:1px solid rgba(13,148,136,.22)',
        'background:rgba(255,255,255,.86)',
        'color:#115e59',
        'font-weight:800',
        'text-decoration:none'
      ].join(';');
      return anchor;
    };

    nav.append(
      makeLink('./privacy.html', 'حریم خصوصی'),
      makeLink('./accessibility.html', 'دسترس‌پذیری')
    );

    if (host === document.body) host.appendChild(nav);
    else host.appendChild(nav);
  };

  const schedule = () => queueMicrotask(ensureGovernanceLinks);
  const observer = new MutationObserver(schedule);
  observer.observe(document.documentElement, { childList: true, subtree: true });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureGovernanceLinks, { once: true });
  } else {
    ensureGovernanceLinks();
  }
})();
