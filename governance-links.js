(() => {
  'use strict';

  const ensureGovernanceLinks = () => {
    if (document.querySelector('[data-mina-governance-links]')) return;

    const host = document.querySelector('footer') || document.body;
    if (!host) return;

    const nav = document.createElement('nav');
    nav.setAttribute('data-mina-governance-links', 'true');
    nav.setAttribute('data-mina-governance-version', '2');
    nav.setAttribute('aria-label', 'اطلاعات، ایمنی و سیاست‌های سایت');

    const makeLink = (href, label) => {
      const anchor = document.createElement('a');
      anchor.href = new URL(href, document.baseURI).href;
      anchor.textContent = label;
      return anchor;
    };

    nav.append(
      makeLink('./status.html', 'وضعیت سیستم'),
      makeLink('./privacy.html', 'حریم خصوصی'),
      makeLink('./accessibility.html', 'دسترس‌پذیری'),
      makeLink('./ai-transparency.html', 'شفافیت AI'),
      makeLink('./editorial-governance.html', 'حاکمیت محتوای پزشکی')
    );

    host.appendChild(nav);
  };

  let scheduled = false;
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    queueMicrotask(() => {
      scheduled = false;
      ensureGovernanceLinks();
    });
  };

  const observer = new MutationObserver(schedule);
  observer.observe(document.documentElement, { childList: true, subtree: true });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureGovernanceLinks, { once: true });
  } else {
    ensureGovernanceLinks();
  }
})();
