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
      if (/۰۹۱۰۵۳۰۶۱۴۲|09105306142/.test(placeholder)) control.placeholder = '09xxxxxxxxx';
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
      control.name = 'contact_method'; control.autocomplete = 'off';
      control.inputMode = 'text'; control.placeholder = 'شماره تماس یا راه ارتباطی';
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

  const TEXT_REPLACEMENTS = [
    ['۰۹۱۰۵۳۰۶۱۴۲', 'شماره تماس در حال تأیید'],
    ['09105306142', 'شماره تماس در حال تأیید'],
    ['galaxy.mehdi.m@gmail.com', 'ایمیل رسمی در حال تأیید'],
    ['تهران، منطقه ۲۲، خیابان امیرکبیر، گلها، نبش یاس', 'تهران، منطقه ۲۲ — نشانی دقیق در حال تأیید'],
    ['خیابان امیرکبیر، گلها، نبش یاس', 'نشانی دقیق در حال تأیید'],
    ['شنبه تا چهارشنبه: ۹ تا ۲۱', 'شنبه تا چهارشنبه: در حال تأیید'],
    ['پنجشنبه: ۹ تا ۱۴', 'پنجشنبه: در حال تأیید'],
    ['جمعه: با نوبت قبلی', 'جمعه: در حال تأیید'],
    ['تخصصی‌ترین کلینیک', 'تجربه مدرن'],
    ['تخصصی‌ترین مرکز جراحی فک و صورت در تهران با تکنیک‌های پیشرفته', 'آشنایی با مسیر ارزیابی و درمان‌های جراحی دهان، فک و صورت'],
    ['یکی از برترین متخصصان دندانپزشکی در تهران است', 'اطلاعات حرفه‌ای و رزومه پس از تأیید مستند منتشر می‌شود'],
    ['دارای مدرک تخصصی از آلمان، دبی و ایران', 'سوابق و مدارک حرفه‌ای پس از تأیید مستند'],
    ['مدرک تخصصی جراحی فک و صورت از آلمان', 'سوابق تخصصی پس از تأیید مستند'],
    ['مدرک آلمان، دبی و ایران', 'مدارک حرفه‌ای در حال تأیید'],
    ['آلمان | دبی | ایران', 'مدارک در حال تأیید'],
    ['۳ مدرک', 'مدارک حرفه‌ای'],
    ['مدارک بین‌المللی', 'مدارک حرفه‌ای'],
    ['بیش از ۱۵ سال سابقه درخشان', 'با تمرکز بر تجربه بیمار و ارائه اطلاعات شفاف'],
    ['۱۵+', '—'],
    ['سال تجربه تخصصی', 'سابقه حرفه‌ای پس از تأیید'],
    ['سال تجربه', 'سابقه حرفه‌ای پس از تأیید'],
    ['تجهیزات فوق پیشرفته', 'تجهیزات و فناوری'],
    ['مجهز به جدیدترین تکنولوژی‌های دندانپزشکی روز دنیا', 'فهرست تجهیزات پس از تأیید واقعی منتشر می‌شود'],
    ['هوش مصنوعی و تجهیزات پیشرفته', 'تجربه دیجیتال و دسترسی بهتر'],
    ['هوش مصنوعی و تکنولوژی روز دنیا', 'جزئیات فناوری و تجهیزات پس از تأیید'],
    ['سئو و رتبه اول گوگل', 'بهینه‌سازی فنی برای جست‌وجو'],
    ['بهینه‌سازی شده برای بالاترین رتبه در نتایج جستجوی گوگل و اینستاگرام', 'بهینه‌سازی فنی برای دسترسی بهتر در جست‌وجو؛ بدون تضمین رتبه'],
    ['بالاترین سطح علمی دندانپزشکی', 'اطلاعات علمی پس از تأیید مستند'],
    ['مشاوره رایگان ۲۴ ساعته', 'وضعیت پاسخ‌گویی در حال تأیید'],
    ['مشاوره رایگان واتساپ', 'راه ارتباطی پس از تأیید'],
    ['مشاوره واتساپ', 'راه ارتباطی پس از تأیید'],
    ['تماس از طریق واتساپ', 'راه ارتباطی پس از تأیید'],
    ['یا رزرو از طریق واتساپ', 'اتصال عملیاتی پس از تأیید'],
    ['یا پیام از طریق واتساپ', 'اتصال عملیاتی پس از تأیید'],
    ['پاسخگویی ۲۴ ساعته', 'ساعات پاسخ‌گویی پس از تأیید'],
    ['ضمانت ۱۰ ساله', 'شرایط پیگیری پس از تأیید'],
    ['ضمانت ۵ ساله', 'شرایط پیگیری پس از تأیید'],
    ['ضمانت کیفیت', 'شرایط پیگیری پس از تأیید'],
    ['ضمانت درمان', 'شرایط پیگیری پس از تأیید'],
    ['ایمپلنت‌های سوئیسی و آلمانی با ضمانت طولانی‌مدت', 'نوع و برند ایمپلنت پس از ارزیابی و تأیید اطلاعات کلینیک مشخص می‌شود'],
    ['میکروسکوپ دیجیتال', 'جزئیات ابزار درمان پس از تأیید'],
    ['درمان تک جلسه‌ای', 'تعداد جلسات پس از ارزیابی مشخص می‌شود'],
    ['با استفاده از میکروسکوپ‌های پیشرفته و روتاری مدرن', 'با برنامه درمانی متناسب با شرایط هر بیمار'],
    [' bleaching لیزری', 'سفیدکردن حرفه‌ای'],
    ['۸ درجه سفیدتر در یک جلسه بدون حساسیت', 'نتیجه و حساسیت در افراد متفاوت است'],
    ['سفیدکردن ۸ درجه‌ای دندان‌ها در یک جلسه', 'آشنایی با سفیدکردن دندان و عوامل مؤثر بر نتیجه'],
    ['ونیر سرامیکی ۲۰ عددی برای لبخندی درخشان', 'نمونه درمان زیبایی؛ جزئیات فقط با رضایت و مستندات واقعی منتشر می‌شود'],
    ['اصلاح نامرتبی شدید دندان‌ها در ۱۸ ماه', 'مدت درمان بر اساس شرایط فردی متفاوت است'],
    ['نمونه‌های واقعی از درمان‌های انجام شده در کلینیک ما', 'نمونه‌های درمان فقط پس از تأیید رضایت بیمار و مستندات منتشر می‌شوند'],
    ['نظرات واقعی بیمارانی که به ما اعتماد کرده‌اند', 'نظرات فقط پس از فرآیند تأیید و رضایت منتشر می‌شوند'],
    ['همچنین امکان پرداخت اقساط نیز فراهم است', 'شرایط پرداخت پس از تأیید رسمی اعلام می‌شود'],
    ['کلینیک دکتر مازندرانی با اکثر بیمه‌های تکمیلی طرف قرارداد است', 'وضعیت بیمه‌های طرف قرارداد پس از تأیید رسمی اعلام می‌شود'],
    ['بسیاری از بزرگسالان با ارتودنسی نامرئی (Invisalign) به نتایج عالی دست می‌یابند', 'روش مناسب ارتودنسی و نتیجه مورد انتظار باید پس از ارزیابی فردی تعیین شود'],
    ['تمامی درمان‌های جراحی و تهاجمی با بی‌حسی موضعی انجام می‌شوند', 'نوع بی‌حسی یا آرام‌بخشی برای هر درمان پس از ارزیابی پزشک تعیین می‌شود'],
    ['همچنین برای بیمارانی که دچار اضطراب هستند، گزینه‌های sedition و بیهوشی نیز موجود است', 'امکانات آرام‌بخشی یا بیهوشی فقط پس از تأیید امکانات مرکز و ارزیابی پزشکی اعلام می‌شود'],
    ['نوبت خود را آنلاین رزرو کنید', 'درخواست نوبت را بررسی کنید'],
    ['فرم رزرو نوبت', 'فرم درخواست نوبت'],
    ['ثبت نوبت', 'بررسی فرم'],
    ['رزرو نوبت آنلاین', 'درخواست نوبت'],
    ['پیام خود را برای ما ارسال کنید', 'فرم تماس را بررسی کنید؛ ارسال عملیاتی هنوز متصل نیست'],
    ['ارسال پیام', 'بررسی فرم'],
    ['کلینیکی فوق مدرن با تبلیغات هوشمند', 'تجربه‌ای مدرن با دسترسی دیجیتال بهتر'],
    ['با اولین جستجو در گوگل و اینستاگرام، ما را پیدا خواهید کرد', 'دیده‌شدن در جست‌وجو به عوامل متعدد وابسته است و رتبه تضمین نمی‌شود'],
    ['تبلیغات هوشمندانه و بهینه‌سازی برای موتورهای جستجو', 'تجربه دیجیتال و بهینه‌سازی فنی برای جست‌وجو'],
    ['بیماران از سراسر تهران و ایران برای دریافت خدمات به این کلینیک مراجعه می‌کنند', 'محدوده خدمت‌رسانی دقیق پس از تأیید اطلاعات عملیاتی منتشر می‌شود']
  ];

  const sanitizeTextNodes = (root = document.body) => {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const parent = node.parentElement;
      if (!parent || ['SCRIPT','STYLE','NOSCRIPT'].includes(parent.tagName)) continue;
      let value = node.nodeValue || '';
      let next = value;
      for (const [from, to] of TEXT_REPLACEMENTS) {
        if (next.includes(from)) next = next.split(from).join(to);
      }
      if (next !== value) node.nodeValue = next;
    }
  };

  const disableUnverifiedOutboundLinks = () => {
    const patterns = [
      /tel:\+?989105306142/i,
      /wa\.me\/989105306142/i,
      /t\.me\/drmazandarani/i,
      /instagram\.com\/drmazandarani/i,
      /mailto:galaxy\.mehdi\.m@gmail\.com/i
    ];
    document.querySelectorAll('a[href]').forEach(anchor => {
      const href = anchor.getAttribute('href') || '';
      if (!patterns.some(pattern => pattern.test(href))) return;
      anchor.removeAttribute('href');
      anchor.setAttribute('aria-disabled', 'true');
      anchor.setAttribute('data-mina-owner-gated', 'contact');
      anchor.title = 'این راه ارتباطی هنوز توسط مالک تأیید نشده است.';
      anchor.style.cursor = 'not-allowed';
      anchor.style.opacity = '.62';
    });
  };

  const gateMapControls = () => {
    document.querySelectorAll('#appointment button, #contact button').forEach(button => {
      if (!/گوگل مپ|نشان|بلد|ویز/.test(text(button))) return;
      button.disabled = true;
      button.setAttribute('aria-disabled', 'true');
      button.title = 'موقعیت دقیق هنوز توسط مالک تأیید نشده است.';
    });

    document.querySelectorAll('#contact iframe, #appointment iframe').forEach(frame => {
      if (frame.dataset.minaTruthGuarded === 'true') return;
      frame.dataset.minaTruthGuarded = 'true';
      frame.hidden = true;
      const notice = document.createElement('div');
      notice.setAttribute('role', 'status');
      notice.className = 'bg-amber-50 border border-amber-200 rounded-2xl p-5 text-sm text-amber-900 leading-relaxed';
      notice.textContent = 'نقشه و نشانی دقیق پس از تأیید رسمی Map Pin و آدرس کلینیک فعال می‌شود.';
      frame.insertAdjacentElement('afterend', notice);
    });
  };

  const gateSection = (id, title, description) => {
    const section = document.getElementById(id);
    if (!section || section.dataset.minaTruthGuarded === 'true') return;
    section.dataset.minaTruthGuarded = 'true';
    section.hidden = true;
    section.setAttribute('aria-hidden', 'true');

    const replacement = document.createElement('section');
    replacement.id = `${id}-verified-gate`;
    replacement.setAttribute('data-mina-truth-replacement', id);
    replacement.className = section.className || 'section-padding bg-white';
    replacement.innerHTML = `
      <div class="container mx-auto container-padding">
        <div class="max-w-3xl mx-auto bg-white rounded-3xl p-8 md:p-10 shadow-lg shadow-teal-900/5 border border-teal-100 text-center">
          <div class="inline-flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-full px-4 py-2 mb-5 text-amber-800 text-sm font-medium">در انتظار تأیید مستند</div>
          <h2 class="text-2xl md:text-3xl font-black text-gray-900 mb-4">${title}</h2>
          <p class="text-gray-500 leading-relaxed">${description}</p>
        </div>
      </div>`;
    section.insertAdjacentElement('afterend', replacement);
  };

  const addOperationalGateNotices = () => {
    document.querySelectorAll('#appointment form, #contact form').forEach(form => {
      if (form.querySelector('[data-mina-pre-submit-gate]')) return;
      const notice = document.createElement('div');
      notice.setAttribute('data-mina-pre-submit-gate', 'true');
      notice.className = 'bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-900 leading-relaxed mb-5';
      notice.textContent = 'این فرم برای تست رابط کاربری فعال است؛ تا اتصال Backend و کانال ارتباطی تأییدشده، هیچ اطلاعاتی ارسال یا ثبت نمی‌شود و زمان‌های نمایش‌داده‌شده به معنی ظرفیت واقعی نیستند.';
      form.prepend(notice);
    });
  };

  const truthGuard = () => {
    sanitizeTextNodes();
    disableUnverifiedOutboundLinks();
    gateMapControls();
    addOperationalGateNotices();

    gateSection(
      'stats',
      'اعتماد با عددهای قابل اثبات',
      'آمار سابقه، تعداد بیماران، درصد رضایت و مدارک فقط پس از دریافت سند یا منبع قابل ممیزی منتشر می‌شوند؛ عدد نمونه یا تبلیغاتی نمایش داده نمی‌شود.'
    );
    gateSection(
      'before-after',
      'گالری درمان با رضایت واقعی بیمار',
      'Before/After فقط با فایل واقعی، رضایت قابل اثبات بیمار، توضیح درمان و هشدار تفاوت نتایج فردی منتشر خواهد شد.'
    );
    gateSection(
      'testimonials',
      'Verified Patient Reviews',
      'نظر بیمار فقط پس از فرآیند تأیید، رضایت برای انتشار و جلوگیری از Review ساختگی یا گمراه‌کننده نمایش داده می‌شود.'
    );
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

    truthGuard();
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
