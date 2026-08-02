(() => {
  'use strict';

  const CONFIG_URL = './clinic-config.json';
  let config = null;
  let opened = false;

  const safeText = value => String(value || '').replace(/[<>]/g, '').slice(0, 2000);
  const normalize = value => safeText(value).trim().replace(/\s+/g, ' ');

  async function loadConfig() {
    try {
      const response = await fetch(`${CONFIG_URL}?v=${Date.now()}`, { cache: 'no-store' });
      if (response.ok) config = await response.json();
    } catch {}
  }

  function fallbackReply(message) {
    const m = normalize(message);
    if (/نوبت|رزرو|وقت/.test(m)) return 'برای ثبت درخواست نوبت، بخش رزرو را باز می‌کنم. تاریخ شمسی و ساعت مناسب را انتخاب کنید؛ تأیید نهایی پس از بررسی ظرفیت انجام می‌شود.';
    if (/لوکیشن|آدرس|نقشه|مسیریابی/.test(m)) return 'موقعیت مطب در تهران، منطقه ۲۱، بلوار گل‌ها، محدوده یاس اول است. از دکمه نقشه برای بازکردن مسیر دقیق استفاده کنید.';
    if (/ایمپلنت/.test(m)) return 'برای ایمپلنت، ابتدا معاینه و بررسی تصویربرداری و شرایط استخوان لازم است. دستیار نمی‌تواند بدون معاینه تشخیص یا قیمت قطعی اعلام کند.';
    if (/درد|تورم|خونریزی|اورژانس/.test(m)) return 'اگر درد شدید، تورم منتشر، تب، خونریزی کنترل‌نشده یا مشکل تنفسی دارید، مراجعه فوری حضوری یا اورژانسی لازم است. این گفت‌وگو جایگزین معاینه نیست.';
    if (/قیمت|هزینه|تعرفه/.test(m)) return 'هزینه دقیق به معاینه، نوع درمان و مواد موردنیاز وابسته است. می‌توانم شما را به ثبت درخواست مشاوره هدایت کنم.';
    return 'می‌توانم درباره خدمات، آمادگی قبل از مراجعه، موقعیت مطب و ثبت درخواست نوبت راهنمایی کنم. برای تشخیص یا تصمیم درمانی، معاینه پزشک لازم است.';
  }

  async function askBackend(message, sessionId) {
    const endpoint = config?.ai?.publicAssistantEndpoint;
    if (!endpoint) return null;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'omit',
      body: JSON.stringify({
        message: normalize(message),
        sessionId,
        locale: 'fa-IR',
        channel: 'website',
        allowedTools: ['services.read','availability.read','booking.request','offers.read','articles.read','location.read'],
        prohibitedTools: ['diagnosis.write','prescription.write','finance.write','patient-record.read-without-consent']
      })
    });
    if (!response.ok) throw new Error(`AI HTTP ${response.status}`);
    const data = await response.json();
    return safeText(data?.answer || data?.message || '');
  }

  function styles() {
    if (document.getElementById('mina-ai-style')) return;
    const style = document.createElement('style');
    style.id = 'mina-ai-style';
    style.textContent = `
      .mina-ai-launch{position:fixed;left:18px;bottom:max(88px,calc(env(safe-area-inset-bottom) + 76px));z-index:2147481500;width:58px;height:58px;border:0;border-radius:50%;background:#0d9488;color:#fff;box-shadow:0 14px 40px rgba(13,148,136,.35);font:700 24px/1 inherit;cursor:pointer}
      .mina-ai-panel{position:fixed;left:12px;right:12px;bottom:max(12px,env(safe-area-inset-bottom));z-index:2147481600;max-width:430px;margin-left:auto;background:#fff;border:1px solid rgba(13,148,136,.2);border-radius:24px;box-shadow:0 24px 80px rgba(15,23,42,.24);overflow:hidden;display:none;direction:rtl;font-family:inherit}
      .mina-ai-panel[data-open="1"]{display:block}.mina-ai-head{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;background:#f0fdfa}.mina-ai-head strong{color:#134e4a}.mina-ai-close{border:0;background:#fff;border-radius:10px;width:36px;height:36px;font-size:22px}.mina-ai-body{height:min(52vh,420px);overflow:auto;padding:14px;background:#fff}.mina-ai-msg{max-width:88%;padding:10px 12px;border-radius:16px;margin:8px 0;line-height:1.8;font-size:13px}.mina-ai-msg[data-role="assistant"]{background:#f1f5f9;color:#1e293b}.mina-ai-msg[data-role="user"]{background:#0d9488;color:#fff;margin-right:auto}.mina-ai-quick{display:flex;gap:6px;overflow:auto;padding:0 14px 10px}.mina-ai-quick button{white-space:nowrap;border:0;background:#ecfeff;color:#155e75;border-radius:999px;padding:8px 10px;font:600 11px inherit}.mina-ai-form{display:flex;gap:8px;padding:12px;border-top:1px solid #e2e8f0}.mina-ai-form input{flex:1;border:1px solid #cbd5e1;border-radius:14px;padding:11px;font:inherit}.mina-ai-form button{border:0;background:#0d9488;color:#fff;border-radius:14px;padding:0 16px;font-weight:700}.mina-ai-note{font-size:10px;color:#64748b;padding:0 14px 12px;line-height:1.7}
    `;
    document.head.appendChild(style);
  }

  function mount() {
    if (document.getElementById('mina-ai-launch')) return;
    styles();
    const launch = document.createElement('button');
    launch.id = 'mina-ai-launch'; launch.className = 'mina-ai-launch'; launch.type = 'button'; launch.setAttribute('aria-label','باز کردن دستیار هوشمند'); launch.textContent = '✦';
    const panel = document.createElement('section');
    panel.className = 'mina-ai-panel'; panel.id = 'mina-ai-panel'; panel.setAttribute('aria-label','دستیار هوشمند مینا دنتال');
    panel.innerHTML = `<div class="mina-ai-head"><strong>دستیار هوشمند مینا دنتال</strong><button class="mina-ai-close" type="button" aria-label="بستن">×</button></div><div class="mina-ai-body"><div class="mina-ai-msg" data-role="assistant">سلام. برای خدمات، نوبت، مسیر مطب و آمادگی قبل از مراجعه راهنمایی‌تان می‌کنم.</div></div><div class="mina-ai-quick"><button type="button">رزرو نوبت</button><button type="button">لوکیشن مطب</button><button type="button">ایمپلنت</button><button type="button">هزینه درمان</button></div><form class="mina-ai-form"><input maxlength="500" aria-label="پیام شما" placeholder="سؤال خود را بنویسید…"><button type="submit">ارسال</button></form><div class="mina-ai-note">این دستیار جایگزین معاینه و تشخیص پزشک نیست. اطلاعات حساس پزشکی را در چت عمومی وارد نکنید.</div>`;
    document.body.append(launch, panel);
    const body = panel.querySelector('.mina-ai-body');
    const input = panel.querySelector('input');
    const sessionId = crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`;

    const add = (role, text) => { const el=document.createElement('div'); el.className='mina-ai-msg'; el.dataset.role=role; el.textContent=text; body.appendChild(el); body.scrollTop=body.scrollHeight; };
    const open = () => { opened=true; panel.dataset.open='1'; input.focus(); window.minaDental?.emit?.('ai_assistant_open'); };
    const close = () => { opened=false; panel.dataset.open='0'; };
    launch.addEventListener('click',()=>opened?close():open());
    panel.querySelector('.mina-ai-close').addEventListener('click',close);
    panel.querySelectorAll('.mina-ai-quick button').forEach(btn=>btn.addEventListener('click',()=>{input.value=btn.textContent; panel.querySelector('form').requestSubmit();}));
    panel.querySelector('form').addEventListener('submit',async event=>{
      event.preventDefault(); const message=normalize(input.value); if(!message)return; input.value=''; add('user',message); window.minaDental?.emit?.('ai_question',{intent:message.slice(0,60)});
      let answer=''; try{answer=await askBackend(message,sessionId);}catch{}
      if(!answer) answer=fallbackReply(message); add('assistant',answer);
      if(/نوبت|رزرو/.test(message)) document.querySelector('#appointment')?.scrollIntoView({behavior:'smooth'});
    });
  }

  async function init(){await loadConfig(); mount();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
