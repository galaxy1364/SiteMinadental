(() => {
  'use strict';

  const CONFIG_URL = './clinic-config.json';
  const faDigits = '۰۱۲۳۴۵۶۷۸۹';
  const monthNames = ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
  const weekdayNames = ['شنبه','یکشنبه','دوشنبه','سه‌شنبه','چهارشنبه','پنجشنبه','جمعه'];
  const holidayCache = new Map();
  let config = null;

  const toFa = value => String(value).replace(/\d/g, d => faDigits[d]);
  const pad = n => String(n).padStart(2, '0');
  const jalaliParts = date => {
    const parts = new Intl.DateTimeFormat('fa-IR-u-ca-persian-nu-latn', {
      year: 'numeric', month: 'numeric', day: 'numeric'
    }).formatToParts(date);
    const get = type => Number(parts.find(p => p.type === type)?.value || 0);
    return { year: get('year'), month: get('month'), day: get('day') };
  };
  const jalaliKey = date => {
    const p = jalaliParts(date);
    return `${p.year}/${pad(p.month)}/${pad(p.day)}`;
  };
  const localDateKey = date => `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}`;
  const weekdayIndex = date => (date.getDay() + 1) % 7; // Saturday=0 ... Friday=6

  async function loadConfig() {
    const response = await fetch(`${CONFIG_URL}?v=${Date.now()}`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Config HTTP ${response.status}`);
    config = await response.json();
    return config;
  }

  function findAppointmentSection() {
    return document.querySelector('#appointment') || [...document.querySelectorAll('section')].find(section => /نوبت|رزرو/.test(section.textContent || ''));
  }

  function findDateInput(section) {
    return section?.querySelector('input[type="date"], input[name*="date" i], input[placeholder*="تاریخ"]');
  }

  function findTimeControl(section) {
    return section?.querySelector('select[name*="time" i], input[name*="time" i], [role="combobox"]');
  }

  async function holidayInfo(jy, jm, jd) {
    const key = `${jy}/${jm}/${jd}`;
    if (holidayCache.has(key)) return holidayCache.get(key);
    const manual = config?.holidays?.manualOverrides?.[`${jy}/${pad(jm)}/${pad(jd)}`];
    if (manual) {
      const value = { isHoliday: Boolean(manual.isHoliday), title: manual.title || '' };
      holidayCache.set(key, value);
      return value;
    }
    const cachedRaw = localStorage.getItem(`mina_holiday_${key}`);
    if (cachedRaw) {
      try {
        const cached = JSON.parse(cachedRaw);
        if (Date.now() - cached.savedAt < (config.holidays.cacheDays || 30) * 86400000) {
          holidayCache.set(key, cached.value);
          return cached.value;
        }
      } catch {}
    }
    const url = config.holidays.endpointTemplate
      .replace('{year}', jy).replace('{month}', jm).replace('{day}', jd);
    try {
      const response = await fetch(url, { cache: 'no-store' });
      if (!response.ok) throw new Error(`Holiday HTTP ${response.status}`);
      const data = await response.json();
      const events = Array.isArray(data?.events) ? data.events : Array.isArray(data) ? data : [];
      const isHoliday = Boolean(data?.is_holiday ?? data?.isHoliday ?? data?.holiday ?? events.some(e => e?.is_holiday || e?.isHoliday));
      const title = data?.title || data?.occasion || events.map(e => e?.description || e?.title).filter(Boolean).join('، ');
      const value = { isHoliday, title };
      localStorage.setItem(`mina_holiday_${key}`, JSON.stringify({ savedAt: Date.now(), value }));
      holidayCache.set(key, value);
      return value;
    } catch {
      const fallback = { isHoliday: false, title: '' };
      holidayCache.set(key, fallback);
      return fallback;
    }
  }

  function isClosedByConfig(date) {
    const jKey = jalaliKey(date);
    if (config.booking.extraOpenJalaliDates?.[jKey]) return false;
    if (config.booking.closedJalaliDates?.includes(jKey)) return true;
    return config.booking.closedWeekdays?.includes(weekdayIndex(date));
  }

  function createStyles() {
    if (document.getElementById('mina-booking-styles')) return;
    const style = document.createElement('style');
    style.id = 'mina-booking-styles';
    style.textContent = `
      .mina-jalali-picker{position:fixed;inset:0;z-index:2147483000;background:rgba(15,23,42,.48);display:none;align-items:flex-end;justify-content:center;padding:16px;direction:rtl}
      .mina-jalali-picker[data-open="1"]{display:flex}
      .mina-jalali-card{width:min(520px,100%);max-height:86vh;overflow:auto;background:#fff;border-radius:24px;padding:18px;box-shadow:0 24px 80px rgba(15,23,42,.28);font-family:inherit}
      .mina-jalali-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:14px}
      .mina-jalali-title{font-weight:800;font-size:18px;color:#0f172a}
      .mina-jalali-nav,.mina-jalali-close{border:0;background:#f1f5f9;border-radius:12px;min-width:42px;height:42px;font-size:20px;cursor:pointer}
      .mina-jalali-week,.mina-jalali-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:6px}
      .mina-jalali-week span{text-align:center;font-size:11px;color:#64748b;padding:6px 0}
      .mina-jalali-day{border:0;border-radius:12px;min-height:46px;background:#f8fafc;color:#0f172a;font:inherit;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px}
      .mina-jalali-day small{font-size:9px;color:#64748b;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      .mina-jalali-day[disabled]{opacity:.42;cursor:not-allowed;background:#f1f5f9}
      .mina-jalali-day[data-holiday="1"]{background:#fff1f2;color:#be123c}
      .mina-jalali-day[data-selected="1"]{background:#0d9488;color:#fff}
      .mina-jalali-empty{min-height:46px}
      .mina-jalali-status{margin-top:12px;font-size:12px;color:#64748b;line-height:1.8}
      .mina-install-offer{position:fixed;right:12px;left:12px;bottom:max(12px,env(safe-area-inset-bottom));z-index:2147482000;background:rgba(255,255,255,.98);border:1px solid rgba(13,148,136,.2);border-radius:20px;padding:14px;box-shadow:0 16px 50px rgba(15,23,42,.18);direction:rtl;font-family:inherit;display:none}
      .mina-install-offer[data-show="1"]{display:block}
      .mina-install-offer strong{display:block;color:#0f172a;font-size:15px;margin-bottom:4px}
      .mina-install-offer p{margin:0 0 10px;color:#475569;font-size:12px;line-height:1.7}
      .mina-install-actions{display:flex;gap:8px}
      .mina-install-actions button{border:0;border-radius:12px;padding:10px 14px;font:inherit;font-weight:700;cursor:pointer}
      .mina-install-primary{background:#0d9488;color:#fff;flex:1}
      .mina-install-later{background:#f1f5f9;color:#334155}
    `;
    document.head.appendChild(style);
  }

  function buildPicker(input) {
    createStyles();
    input.type = 'text';
    input.readOnly = true;
    input.inputMode = 'none';
    input.placeholder = 'انتخاب تاریخ شمسی';
    input.setAttribute('autocomplete', 'off');
    input.dataset.calendar = 'persian';

    const overlay = document.createElement('div');
    overlay.className = 'mina-jalali-picker';
    overlay.innerHTML = `<div class="mina-jalali-card" role="dialog" aria-modal="true" aria-label="انتخاب تاریخ شمسی">
      <div class="mina-jalali-head"><button class="mina-jalali-nav" data-dir="-1" aria-label="ماه قبل">›</button><div class="mina-jalali-title"></div><button class="mina-jalali-nav" data-dir="1" aria-label="ماه بعد">‹</button><button class="mina-jalali-close" aria-label="بستن">×</button></div>
      <div class="mina-jalali-week">${weekdayNames.map(x=>`<span>${x}</span>`).join('')}</div>
      <div class="mina-jalali-grid"></div><div class="mina-jalali-status">تعطیلات رسمی و جمعه‌ها قابل رزرو نیستند. ثبت نهایی پس از بررسی ظرفیت مطب تأیید می‌شود.</div>
    </div>`;
    document.body.appendChild(overlay);

    const today = new Date(); today.setHours(0,0,0,0);
    const days = [];
    for (let i=0;i<=config.booking.bookingWindowDays;i++) {
      const d = new Date(today); d.setDate(today.getDate()+i); days.push(d);
    }
    const groups = new Map();
    for (const d of days) {
      const p = jalaliParts(d); const k = `${p.year}-${p.month}`;
      if (!groups.has(k)) groups.set(k, []); groups.get(k).push(d);
    }
    const months = [...groups.entries()];
    let monthIndex = 0;
    let selected = null;

    const render = async () => {
      const [key, dates] = months[monthIndex];
      const [jy,jm] = key.split('-').map(Number);
      overlay.querySelector('.mina-jalali-title').textContent = `${monthNames[jm-1]} ${toFa(jy)}`;
      const grid = overlay.querySelector('.mina-jalali-grid'); grid.innerHTML = '';
      const first = dates[0]; const firstP = jalaliParts(first);
      const firstMonthDay = new Date(first);
      firstMonthDay.setDate(first.getDate()-(firstP.day-1));
      for (let i=0;i<weekdayIndex(firstMonthDay);i++) grid.appendChild(Object.assign(document.createElement('span'),{className:'mina-jalali-empty'}));
      const monthDates = [];
      let cursor = new Date(firstMonthDay);
      for (let guard=0;guard<32;guard++) {
        const p = jalaliParts(cursor); if (p.month !== jm || p.year !== jy) break;
        monthDates.push(new Date(cursor)); cursor.setDate(cursor.getDate()+1);
      }
      for (const d of monthDates) {
        const p = jalaliParts(d);
        const btn = document.createElement('button'); btn.type='button'; btn.className='mina-jalali-day'; btn.innerHTML=`<span>${toFa(p.day)}</span><small></small>`;
        const outside = d < today || d > days[days.length-1];
        const closed = outside || isClosedByConfig(d);
        btn.disabled = closed;
        if (selected && localDateKey(selected)===localDateKey(d)) btn.dataset.selected='1';
        btn.addEventListener('click',()=>{
          selected=d;
          input.value=`${toFa(p.year)}/${toFa(pad(p.month))}/${toFa(pad(p.day))}`;
          input.dataset.isoDate=localDateKey(d);
          input.dataset.jalaliDate=`${p.year}/${pad(p.month)}/${pad(p.day)}`;
          input.dispatchEvent(new Event('input',{bubbles:true})); input.dispatchEvent(new Event('change',{bubbles:true}));
          overlay.dataset.open='0';
          updateTimeSlots(d);
        });
        grid.appendChild(btn);
        holidayInfo(p.year,p.month,p.day).then(info=>{
          if (info.isHoliday && config.holidays.blockOfficialHolidays) { btn.disabled=true; btn.dataset.holiday='1'; btn.querySelector('small').textContent=info.title||'تعطیل رسمی'; }
        });
      }
      overlay.querySelector('[data-dir="-1"]').disabled = monthIndex===0;
      overlay.querySelector('[data-dir="1"]').disabled = monthIndex===months.length-1;
    };

    const updateTimeSlots = date => {
      const control = findTimeControl(findAppointmentSection());
      if (!control || control.tagName !== 'SELECT') return;
      const periods = config.booking.workingHours[String(weekdayIndex(date))] || [];
      const slots = [];
      for (const period of periods) {
        const [sh,sm]=period.start.split(':').map(Number); const [eh,em]=period.end.split(':').map(Number);
        for (let m=sh*60+sm;m+config.booking.slotMinutes<=eh*60+em;m+=config.booking.slotMinutes) slots.push(`${pad(Math.floor(m/60))}:${pad(m%60)}`);
      }
      control.innerHTML='<option value="">انتخاب ساعت</option>'+slots.map(s=>`<option value="${s}">${toFa(s)}</option>`).join('');
    };

    input.addEventListener('click',()=>{overlay.dataset.open='1';render();});
    overlay.querySelector('.mina-jalali-close').addEventListener('click',()=>overlay.dataset.open='0');
    overlay.addEventListener('click',e=>{if(e.target===overlay)overlay.dataset.open='0';});
    overlay.querySelectorAll('.mina-jalali-nav').forEach(btn=>btn.addEventListener('click',()=>{monthIndex+=Number(btn.dataset.dir);render();}));
  }

  async function init() {
    try { await loadConfig(); } catch (error) { console.error('Clinic config failed', error); return; }
    const mount = () => {
      const input = findDateInput(findAppointmentSection());
      if (input && !input.dataset.minaEnhanced) { input.dataset.minaEnhanced='1'; buildPicker(input); }
    };
    mount();
    new MutationObserver(mount).observe(document.documentElement,{childList:true,subtree:true});
    window.minaClinicConfig = Object.freeze(config);
  }

  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true}); else init();
})();
