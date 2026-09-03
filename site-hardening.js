(() => {
  'use strict';

  const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
  const AR_DIGITS = '٠١٢٣٤٥٦٧٨٩';
  let scheduled = false;

  const toLatinDigits = (value = '') => String(value)
    .replace(/[۰-۹]/g, d => String(FA_DIGITS.indexOf(d)))
    .replace(/[٠-٩]/g, d => String(AR_DIGITS.indexOf(d)));

  const normalizeIranMobile = (value = '') => {
    let phone = toLatinDigits(value).replace(/\D/g, '');
    if (phone.startsWith('0098')) phone = `0${phone.slice(4)}`;
    else if (phone.startsWith('98')) phone = `0${phone.slice(2)}`;
    else if (phone.startsWith('9') && phone.length === 10) phone = `0${phone}`;
    return phone;
  };

  const text = el => (el?.innerText || el?.textContent || '').trim().replace(/\s+/g, ' ');

  const ensureStatusRegion = () => {
    let status = document.getElementById('kimi-a11y-status');
    if (status) return status;
    status = document.createElement('span');
    status.id = 'kimi-a11y-status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    Object.assign(status.style, {
      position: 'absolute', width: '1px', height: '1px', padding: '0', margin: '-1px',
      overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: '0'
    });
    document.body.appendChild(status);
    return status;
  };

  const ensureVisibleFormStatus = form => {
    let status = form.querySelector('[data-mina-operation-status]');
    if (status) return status;
    status = document.createElement('div');
    status.setAttribute('data-mina-operation-status', 'true');
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    Object.assign(status.style, {
      marginTop: '12px', padding: '12px 14px', borderRadius: '14px',
      border: '1px solid rgba(217, 119, 6, .35)', background: 'rgba(217, 119, 6, .08)',
      color: 'inherit', lineHeight: '1.9', fontSize: '13px'
    });
    form.appendChild(status);
    return status;
  };

  const labelForLink = anchor => {
    const href = anchor.getAttribute('href') || '';
    if (/^tel:/i.test(href)) return 'تماس تلفنی با کلینیک';
    if (/wa\.me|whatsapp/i.test(href)) return 'ارتباط با کلینیک در واتساپ';
    if (/instagram/i.test(href)) return 'صفحه اینستاگرام کلینیک';
    if (/t\.me|telegram/i.test(href)) return 'کانال تلگرام کلینیک';
    if (/google.*maps|maps\.google/i.test(href)) return 'موقعیت در نقشه';
    if (/neshan/i.test(href)) return 'موقعیت در نشان';
    if (/balad/i.test(href)) return 'موقعیت در بلد';
    if (/waze/i.test(href)) return 'موقعیت در ویز';
    if (/^mailto:/i.test(href)) return 'ارسال ایمیل';
    return '';
  };

  const buttonLabel = (button, index) => {
    const cls = button.className?.toString() || '';
    if (button.getAttribute('aria-haspopup') === 'dialog' || /lg:hidden/.test(cls)) return 'باز کردن منوی سایت';
    if (/fixed/.test(cls) && /bottom/.test(cls)) return 'بازگشت به بالای صفحه';
    if (/w-3/.test(cls) && /h-3/.test(cls) && /rounded-full/.test(cls)) return `نمایش اسلاید شماره ${index + 1}`;
    if (/absolute/.test(cls) && /right-0/.test(cls)) return 'مورد قبلی';
    if (/absolute/.test(cls) && /left-0/.test(cls)) return 'مورد بعدی';
    const section = button.closest('section');
    const heading = section?.querySelector('h1,h2,h3');
    return heading ? `کنترل تعاملی بخش ${text(heading)}` : `دکمه تعاملی شماره ${index + 1}`;
  };

  const setControlMetadata = control => {
    const placeholder = control.getAttribute('placeholder') || '';
    const section = control.closest('section');
    const isAppointment = section?.id === 'appointment';
    const isContact = section?.id === 'contact';
    const parent = control.closest('.space-y-2') || control.parentElement;
    const visibleLabel = parent?.querySelector('label');

    if (!control.id) {
      const base = isAppointment ? 'appointment' : isContact ? 'contact' : 'field';
      control.id = `${base}-${control.tagName.toLowerCase()}-${Math.random().toString(36).slice(2, 9)}`;
    }
    if (visibleLabel && !visibleLabel.getAttribute('for')) visibleLabel.setAttribute('for', control.id);
    if (!control.getAttribute('aria-label') && visibleLabel) control.setAttribute('aria-label', text(visibleLabel));

    if (control.id === 'name' || placeholder.includes('نام کامل')) {
      control.name = 'full_name'; control.autocomplete = 'name';
    } else if (control.id === 'phone' || placeholder.includes('۰۹۱۰')) {
      control.name = 'phone'; control.autocomplete = 'tel'; control.inputMode = 'tel';
      control.setAttribute('pattern', '09[0-9]{9}'); control.minLength = 11; control.maxLength = 11;
    } else if (control.id === 'date' || control.type === 'date') {
      control.name = 'requested_date';
      const now = new Date();
      const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
      control.min = local;
    } else if (control.id === 'message' || placeholder.includes('توضیحات')) {
      control.name = isAppointment ? 'appointment_message' : 'message';
    } else if (placeholder.includes('نام شما')) {
      control.name = 'contact_name'; control.autocomplete = 'name';
    } else if (placeholder.includes('your@email.com')) {
      control.name = 'email'; control.type = 'email'; control.autocomplete = 'email'; control.inputMode = 'email';
    } else if (placeholder.includes('موضوع پیام')) {
      control.name = 'subject';
    } else if (placeholder.includes('پیام خود را')) {
      control.name = 'message';
    }

    if (control.tagName === 'SELECT') {
      const optionsText = [...control.options].map(o => text(o)).join(' ');
      if (/خدمت/.test(optionsText)) control.name = 'service';
      else if (/ساعت/.test(optionsText)) control.name = 'time';
    }
  };

  const enhance = () => {
    scheduled = false;
    document.documentElement.lang = 'fa';
    document.documentElement.dir = 'rtl';

    document.querySelectorAll('nav').forEach((nav, i) => {
      if (!nav.getAttribute('aria-label')) nav.setAttribute('aria-label', i === 0 ? 'ناوبری اصلی' : `ناوبری شماره ${i + 1}`);
    });

    document.querySelectorAll('a').forEach(anchor => {
      if (anchor.target === '_blank') {
        const rel = new Set((anchor.rel || '').split(/\s+/).filter(Boolean));
        rel.add('noopener'); rel.add('noreferrer'); anchor.rel = [...rel].join(' ');
      }
      if (!text(anchor) && !anchor.getAttribute('aria-label')) {
        const label = labelForLink(anchor);
        if (label) anchor.setAttribute('aria-label', label);
      }
    });

    document.querySelectorAll('button').forEach((button, index) => {
      if (!button.hasAttribute('type')) button.type = 'button';
      if (!text(button) && !button.getAttribute('aria-label') && !button.getAttribute('title')) {
        button.setAttribute('aria-label', buttonLabel(button, index));
      }
      const srOnly = [...button.querySelectorAll('.sr-only')].find(el => text(el) === 'Close');
      if (srOnly) srOnly.textContent = 'بستن';
    });

    document.querySelectorAll('input,select,textarea').forEach(setControlMetadata);

    document.querySelectorAll('img').forEach((img, index) => {
      img.decoding = 'async';
      img.draggable = false;
      if (img.closest('#hero') && index === 0) {
        img.loading = 'eager'; img.fetchPriority = 'high';
      } else if (!img.hasAttribute('loading')) {
        img.loading = 'lazy';
      }
    });

    const h1s = [...document.querySelectorAll('h1')];
    h1s.slice(1).forEach(h => { h.setAttribute('role', 'heading'); h.setAttribute('aria-level', '2'); });

    document.querySelectorAll('section[id]').forEach(section => {
      const heading = section.querySelector('h1,h2,h3');
      if (heading) {
        if (!heading.id) heading.id = `${section.id}-heading`;
        section.setAttribute('aria-labelledby', heading.id);
      }
    });

    ensureStatusRegion();
  };

  const scheduleEnhance = () => {
    if (scheduled) return;
    scheduled = true;
    queueMicrotask(enhance);
  };

  document.addEventListener('submit', event => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    const section = form.closest('section');
    if (!section || !['appointment', 'contact'].includes(section.id)) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    enhance();

    if (section.id === 'appointment') {
      const phoneInput = form.querySelector('#phone, [name="phone"], input[type="tel"]');
      const normalizedPhone = normalizeIranMobile(phoneInput?.value || '');
      if (phoneInput && normalizedPhone) phoneInput.value = normalizedPhone;
      if (!/^09\d{9}$/.test(normalizedPhone)) {
        phoneInput?.setCustomValidity('شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد.');
        phoneInput?.reportValidity();
        phoneInput?.setCustomValidity('');
        return;
      }
    }

    if (!form.reportValidity()) return;

    const message = 'این فرم از نظر رابط کاربری معتبر است، اما اتصال عملیاتی هنوز فعال نشده است؛ هیچ نوبت یا پیامی ثبت یا ارسال نشد.';
    ensureVisibleFormStatus(form).textContent = message;
    ensureStatusRegion().textContent = message;
  }, true);

  const observer = new MutationObserver(scheduleEnhance);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', enhance, { once: true });
  else enhance();
})();
