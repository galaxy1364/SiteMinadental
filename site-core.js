(() => {
  'use strict';

  const STORAGE_KEY = 'mina_dental_attribution_v1';
  const PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'wbraid', 'gbraid', 'fbclid'];
  const INSTAGRAM_URL = 'https://www.instagram.com/dr.mina.mazandarani/';
  const PLACE_TITLE = 'دندانپزشکی تخصصی صدف — دکتر مینا مازندرانی';
  const OFFICIAL_MAP_URL = 'https://maps.app.goo.gl/giT47654NMPreoPt5?g_st=ic';

  const loadModule = (src, key) => {
    const absolute = new URL(src, document.baseURI).href;
    const exists = [...document.scripts].some(script =>
      script.dataset.minaModule === key || (script.src && new URL(script.src, document.baseURI).href === absolute)
    );
    if (exists) return;
    const script = document.createElement('script');
    script.src = src;
    script.defer = true;
    script.dataset.minaModule = key;
    script.addEventListener('error', () => {
      window.dispatchEvent(new CustomEvent('mina:runtime-error', {
        detail: { source: key, message: `Module failed to load: ${src}` }
      }));
    }, { once: true });
    document.head.appendChild(script);
  };

  const applySearchIdentity = () => {
    const description = 'دندانپزشکی تخصصی صدف، کلینیک دکتر مینا مازندرانی در منطقه ۲۱ تهران؛ اطلاعات خدمات، موقعیت رسمی و درخواست نوبت از کانال‌های تأییدشده.';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.content = description;

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Dentist',
      '@id': `${location.origin}${location.pathname}#verified-identity`,
      name: PLACE_TITLE,
      alternateName: ['دندانپزشکی صدف','کلینیک دندانپزشکی صدف','کلینیک دندانپزشکی دکتر مینا مازندرانی','Mina Mazandarani Dental Clinic','Sadaf Dental Clinic Tehran'],
      description,
      url: `${location.origin}${location.pathname}`,
      telephone: '+989105306142',
      hasMap: OFFICIAL_MAP_URL,
      sameAs: [INSTAGRAM_URL, OFFICIAL_MAP_URL],
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'بلوار گل‌ها، محدوده یاس اول',
        addressLocality: 'تهران',
        addressRegion: 'منطقه ۲۱، استان تهران',
        addressCountry: 'IR'
      },
      areaServed: ['منطقه ۲۱ تهران', 'غرب تهران', 'تهران'],
      knowsLanguage: ['fa'],
      potentialAction: [
        { '@type': 'ViewAction', name: 'مشاهده موقعیت رسمی مطب', target: OFFICIAL_MAP_URL },
        { '@type': 'TravelAction', name: 'مسیریابی تا مطب', target: OFFICIAL_MAP_URL }
      ]
    };

    let node = document.getElementById('mina-verified-identity-schema');
    if (!node) {
      node = document.createElement('script');
      node.id = 'mina-verified-identity-schema';
      node.type = 'application/ld+json';
      document.head.appendChild(node);
    }
    node.textContent = JSON.stringify(schema);
  };

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

  window.addEventListener('error', event => {
    emit('runtime_error', {
      source: event.filename || 'window',
      message: String(event.message || 'Unknown runtime error').slice(0, 500),
      line: event.lineno || null,
      column: event.colno || null
    });
  });

  window.addEventListener('unhandledrejection', event => {
    emit('unhandled_rejection', {
      message: String(event.reason?.message || event.reason || 'Unhandled rejection').slice(0, 500)
    });
  });

  window.addEventListener('mina:runtime-error', event => {
    emit('module_runtime_error', event.detail || {});
  });

  document.addEventListener('click', event => {
    const anchor = event.target.closest?.('a[href]');
    if (!anchor) return;
    const href = anchor.getAttribute('href') || '';
    if (/^tel:/i.test(href)) emit('clinic_phone_click');
    else if (/wa\.me|whatsapp/i.test(href)) emit('clinic_whatsapp_click');
    else if (/instagram/i.test(href)) emit('clinic_instagram_click');
    else if (/google.*maps|maps\.google|maps\.app\.goo\.gl/i.test(href)) emit('clinic_map_click');
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

  applySearchIdentity();
  loadModule('./content-upgrade.js', 'content-upgrade');
  loadModule('./content-hub.js', 'content-hub');
  loadModule('./ai-assistant.js', 'ai-assistant');

  window.minaDental = Object.freeze({
    emit,
    attribution,
    place: Object.freeze({ title: PLACE_TITLE, mapUrl: OFFICIAL_MAP_URL }),
    channels: Object.freeze({
      instagram: { status: 'active', url: INSTAGRAM_URL },
      whatsapp: { status: 'active', phone: '+989105306142' },
      googleMaps: { status: 'active', url: OFFICIAL_MAP_URL },
      bale: { status: 'credentials_required' },
      eitaa: { status: 'credentials_required' },
      rubika: { status: 'credentials_required' }
    })
  });

  emit('page_view');
})();
