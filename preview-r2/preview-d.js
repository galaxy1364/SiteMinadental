/* MinaDental Enterprise Audit Center — truthful preview status only */
/* audit pipeline retrigger: html-shell findings fixed */
(function(){
  if (typeof routes !== 'undefined' && !routes.some(r => r[0] === '/audit')) {
    routes.push(['/audit','Enterprise Audit Center','front']);
  }

  const auditGroups = [
    ['Visual / UX','active',[
      ['Premium RTL design system','فعال در Preview'],
      ['Mobile-first app-like navigation','فعال؛ تست دستگاه واقعی باقی است'],
      ['Responsive 320px → ultrawide','کدنویسی شده؛ QA انسانی چنددستگاهی باقی است'],
      ['Motion / reduced-motion','فعال'],
      ['Visual QA inspector','فعال']
    ]],
    ['Accessibility','partial',[
      ['WCAG 2.2 AA automated checks','Pipeline اضافه شده / تست انسانی لازم'],
      ['Keyboard & focus','پیاده‌سازی پایه؛ تست انسانی لازم'],
      ['VoiceOver / TalkBack','Gate: تست دستگاه واقعی'],
      ['Zoom / target-size / focus-not-obscured','Gate: تست انسانی']
    ]],
    ['Performance','partial',[
      ['Lighthouse lab audit','Pipeline اضافه شده'],
      ['LCP ≤ 2.5s','Gate: Field p75 Production'],
      ['INP ≤ 200ms','Gate: Field p75 Production'],
      ['CLS ≤ 0.1','Gate: Field p75 Production'],
      ['Iran weak-network QA','Gate: تست 3G/4G واقعی']
    ]],
    ['Security','partial',[
      ['OWASP Top 10:2025 baseline','در برنامه ممیزی'],
      ['OWASP ASVS 5.0.0','Production gate موجود / تکمیل کنترل‌ها لازم'],
      ['CodeQL SAST','فعال در GitHub'],
      ['Secret leak guard','فعال'],
      ['DAST / ZAP baseline','Pipeline اضافه شده'],
      ['Independent pentest','Gate: ممیزی خارجی']
    ]],
    ['Privacy / Trust','partial',[
      ['Consent preferences UI','فعال در Preview'],
      ['No fake backend success','فعال'],
      ['Data export / delete / correction','Gate: Backend + policy'],
      ['Retention policy enforcement','Gate: Backend + legal review'],
      ['Medical claims evidence gate','فعال در معماری']
    ]],
    ['SEO / Discovery','partial',[
      ['Search Essentials architecture','Foundation موجود'],
      ['People-first medical content workflow','Gate: محتوای تأییدشده + Reviewer'],
      ['Structured data truth-gated','Production V9 foundation'],
      ['Search Console / sitemap submission','Gate: Production domain'],
      ['AI/LLM discoverability','Foundation موجود؛ provenance باید تکمیل شود']
    ]],
    ['AI Governance','partial',[
      ['No diagnosis / prescription / dosage','فعال در Preview'],
      ['Human handoff','تعریف شده'],
      ['NIST AI RMF / GenAI profile mapping','در Audit Matrix'],
      ['ISO/IEC 42001 governance mapping','در Audit Matrix'],
      ['Prompt abuse / red-team suite','Gate: AI backend واقعی']
    ]],
    ['Operations / SRE','partial',[
      ['Status surface','فعال؛ Production health متصل نیست'],
      ['RUM / incidents / feature flags','V9 foundation موجود'],
      ['OpenTelemetry backend','Gate'],
      ['SLO / error budget','Gate'],
      ['Synthetic monitoring','Gate'],
      ['Backup / restore drill + RPO/RTO','Gate']
    ]],
    ['Patient Platform','partial',[
      ['My Mina UI','قابل تست'],
      ['Booking / slot engine','Gate: Backend'],
      ['OTP / identity','Gate: Provider واقعی'],
      ['Payments / reconciliation','Gate: PSP واقعی'],
      ['Treatment plan / e-sign','Foundation؛ Production auth لازم'],
      ['Recall / waitlist / aftercare automation','Gap برای تکمیل']
    ]],
    ['Iran-local Excellence','partial',[
      ['Persian-first RTL','فعال'],
      ['Iran mobile validation','فعال'],
      ['Jalali calendar','Gap'],
      ['Neshan/Balad route adapters','Gap'],
      ['Iran SMS provider','Gate: Provider'],
      ['Iran payment adapter','Gate: Provider']
    ]]
  ];

  function auditCenter(){
    const cards = auditGroups.map(([title,state,items]) => `
      <article class="card">
        <div style="display:flex;justify-content:space-between;gap:12px;align-items:center">
          <h3 style="margin:0">${title}</h3>
          <span class="statusChip ${state==='partial'?'block':''}">${state==='active'?'ACTIVE':'PARTIAL / GATED'}</span>
        </div>
        <div style="margin-top:12px">
          ${items.map(([name,status])=>`<div class="verify ${/فعال|موجود|اضافه شده/.test(status)?'verified':/Gate|Gap|باقی/.test(status)?'pending':'pending'}"><i></i><div><b>${name}</b><span>${status}</span></div></div>`).join('')}
        </div>
      </article>`).join('');

    return pageHero('Enterprise Audit Center','مرکز حقیقت پروژه: چه چیزی قابل تست است، چه چیزی ناقص است و چه چیزی فقط با اتصال Production قابل اثبات می‌شود.','<span class="r3-route-badge">GLOBAL AUDIT MATRIX</span>') + `
      <section class="section card">
        <div class="notice">این صفحه «گواهی انطباق» صادر نمی‌کند. PASS فقط وقتی ثبت می‌شود که تست مربوطه واقعاً اجرا و Evidence ذخیره شده باشد.</div>
        <div class="actions" style="margin-top:14px">
          <a class="btn primary" href="#/qa">Visual QA</a>
          <a class="btn" href="#/status">Production Status</a>
          <a class="btn" href="https://github.com/galaxy1364/SiteMinadental/actions" target="_blank" rel="noopener noreferrer">GitHub Audit Runs ↗</a>
        </div>
      </section>
      <section class="section grid g3">${cards}</section>
      <section class="section card">
        <h2>قفل Production 10/10</h2>
        <p class="muted">Production 10/10 فقط بعد از Domain/Cloudflare واقعی، Backend و RLS واقعی، OTP/MFA/Turnstile/Payment واقعی، تست WCAG انسانی، Field Core Web Vitals، Backup/Restore drill، Observability، Search Console و Pentest مستقل قابل اعلام است.</p>
      </section>`;
  }

  function renderAuditIfNeeded(){
    const path=(location.hash.slice(1)||'/').replace(/\/$/,'') || '/';
    if(path !== '/audit') return false;
    const content=document.getElementById('content');
    if(!content) return false;
    content.innerHTML=auditCenter();
    document.querySelectorAll('.navlinks a').forEach(a=>a.classList.remove('active'));
    document.querySelectorAll('.mobileDock button').forEach(b=>b.classList.remove('active'));
    window.scrollTo(0,0);
    return true;
  }

  const auditLink=document.createElement('a');
  auditLink.href='#/audit'; auditLink.className='pill'; auditLink.textContent='Audit Center';
  const bar=document.querySelector('.previewbar'); if(bar) bar.appendChild(auditLink);
  addEventListener('hashchange',()=>setTimeout(renderAuditIfNeeded,0));
  setTimeout(renderAuditIfNeeded,0);
})();
