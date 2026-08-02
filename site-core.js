(() => {
  'use strict';

  const STORAGE_KEY = 'mina_dental_attribution_v1';
  const PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'wbraid', 'gbraid', 'fbclid'];

  const readAttribution = () => {
    const params = new URLSearchParams(location.search);
    const current = {};
    for (const key of PARAMS) {
      const value = params.get(key);
      if (value) current[key] = value.slice(0, 250);
    }
    if (Object.keys(current).length) {
      current.first_landing_path = location.pathname;
      current.recorded_at = new Date().toISOString();
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(current)); } catch {}
      return current;
    }
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
  };

  const attribution = readAttribution();
  window.dataLayer = window.dataLayer || [];

  const emit = (name, detail = {}) => {
    const payload = {
      event: name,
      event_time: new Date().toISOString(),
      page_path: location.pathname,
      page_title: document.title,
      attribution,
      ...detail
    };
    window.dataLayer.push(payload);
    window.dispatchEvent(new CustomEvent('mina:conversion', { detail: payload }));
  };

  document.addEventListener('click', event => {
    const anchor = event.target.closest?.('a[href]');
    if (!anchor) return;
    const href = anchor.getAttribute('href') || '';
    if (/^tel:/i.test(href)) emit('clinic_phone_click');
    else if (/wa\.me|whatsapp/i.test(href)) emit('clinic_whatsapp_click');
    else if (/instagram/i.test(href)) emit('clinic_instagram_click');
    else if (/google.*maps|maps\.google|neshan|balad|waze/i.test(href)) emit('clinic_map_click');
    else if (href.includes('#appointment')) emit('appointment_intent');
  }, { capture: true });

  document.addEventListener('submit', event => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    const section = form.closest('section[id]');
    emit(section?.id === 'appointment' ? 'appointment_form_submit' : 'contact_form_submit', {
      form_id: form.id || null
    });
  }, { capture: true });

  window.addEventListener('mina:pwa-install-ready', () => emit('pwa_install_ready'));
  window.addEventListener('mina:pwa-install-result', event => emit('pwa_install_result', {
    outcome: event.detail?.outcome || 'unknown'
  }));
  window.addEventListener('mina:pwa-installed', () => emit('pwa_installed'));

  window.minaDental = Object.freeze({ emit, attribution });
  emit('page_view');
})();
