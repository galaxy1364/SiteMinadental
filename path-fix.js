(() => {
  'use strict';
  const BASE = '/SiteMinadental';
  const ROOT_ASSETS = new Set([
    '/before-after.jpg', '/clinic-interior.jpg', '/doctor-portrait.jpg', '/hero-bg.jpg',
    '/service-implant.jpg', '/service-orthodontics.jpg', '/service-pediatric.jpg',
    '/service-rootcanal.jpg', '/service-veneer.jpg', '/service-whitening.jpg'
  ]);
  const resolve = (value) => typeof value === 'string' && ROOT_ASSETS.has(value) ? `${BASE}${value}` : value;
  const originalSetAttribute = Element.prototype.setAttribute;
  Element.prototype.setAttribute = function(name, value) {
    if ((this instanceof HTMLImageElement || this instanceof HTMLSourceElement) && name.toLowerCase() === 'src') value = resolve(value);
    return originalSetAttribute.call(this, name, value);
  };
  const repair = (root = document) => {
    root.querySelectorAll?.('img[src],source[src]').forEach((node) => {
      const current = node.getAttribute('src');
      const fixed = resolve(current);
      if (fixed !== current) originalSetAttribute.call(node, 'src', fixed);
    });
  };
  new MutationObserver((records) => {
    for (const record of records) for (const node of record.addedNodes) if (node.nodeType === 1) repair(node);
  }).observe(document.documentElement, { childList: true, subtree: true });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => repair(), { once: true });
  else repair();
})();
