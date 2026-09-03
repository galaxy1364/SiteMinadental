/* MinaDental R3 progressive visual/UX layer — no backend claims */
(function(){
  const originalHome = window.home;
  const originalServicesHub = window.servicesHub;
  const originalExperience = window.experience;

  window.home = function homeR3(){
    return `
      <section class="r3-hero">
        <div class="r3-hero-media" aria-hidden="true">
          <img src="${A}hero-bg.jpg" alt="">
          <div class="r3-hero-shade"></div>
          <div class="r3-noise"></div>
        </div>
        <div class="r3-hero-content">
          <div class="r3-kicker"><span class="r3-live-dot"></span> VISUAL UX ACCEPTANCE · R3</div>
          <h1>دندانپزشکی که <span>قبل از مراجعه</span><br>قابل فهم است.</h1>
          <p>یک تجربهٔ دیجیتال فارسی‌محور برای شناخت درمان، مقایسه گزینه‌ها، مسیر مراجعه و My Mina — با مرزبندی روشن بین چیزی که واقعاً فعال است و چیزی که هنوز به زیرساخت عملیاتی نیاز دارد.</p>
          <div class="r3-actions">
            ${btn('شروع از خدمات','/services','primary')}
            ${btn('مسیر بیمار','/experience/patient-journey')}
            <button class="btn r3-ghost" onclick="document.getElementById('searchBtn').click()">⌕ جست‌وجوی هوشمند</button>
          </div>
          <div class="r3-proofline">
            <span><b>RTL</b> فارسی‌محور</span><i></i>
            <span><b>Mobile</b> اپ‌مانند</span><i></i>
            <span><b>Truth</b> بدون ادعای جعلی</span>
          </div>
        </div>
        <div class="r3-floating-stack">
          <a class="r3-float-card fc1" href="#/tools/treatment-comparison"><span>01</span><b>مقایسه درمان</b><small>دو گزینه را کنار هم ببین</small></a>
          <a class="r3-float-card fc2" href="#/experience/cost-estimate"><span>02</span><b>تخمین نیاز</b><small>بدون قیمت ساختگی</small></a>
          <a class="r3-float-card fc3" href="#/portal"><span>03</span><b>My Mina</b><small>ساختار پورتال بیمار</small></a>
        </div>
        <a class="r3-scrollcue" href="#r3-services" aria-label="رفتن به خدمات">↓</a>
      </section>

      <section class="r3-intro section">
        <div class="r3-intro-copy">
          <span class="r3-overline">PATIENT EXPERIENCE SYSTEM</span>
          <h2>سایت فقط ویترین نیست؛ <em>مسیر تصمیم بیمار</em> است.</h2>
        </div>
        <p>هر بخش باید یک سؤال واقعی بیمار را پاسخ دهد: چه درمانی؟ چه مراحلی؟ چه تفاوتی؟ هزینه به چه چیزهایی وابسته است؟ قدم بعدی چیست؟</p>
      </section>

      <section class="r3-bento section" aria-label="قابلیت‌های اصلی">
        <a class="r3-bento-card r3-bento-wide r3-photo-card" href="#/experience" style="--photo:url('${A}clinic-interior.jpg')">
          <div class="r3-bento-copy"><span>EXPERIENCE</span><h3>از اولین سؤال تا پیگیری</h3><p>Patient Journey، مشاوره، هزینه و Aftercare در یک مسیر منسجم.</p></div>
        </a>
        <a class="r3-bento-card r3-bento-tall r3-portrait-card" href="#/portal" style="--photo:url('${A}doctor-portrait.jpg')">
          <div class="r3-bento-copy"><span>MY MINA</span><h3>پورتال بیمار</h3><p>Preview ساختاری؛ دادهٔ واقعی هنوز متصل نیست.</p></div>
        </a>
        <a class="r3-bento-card r3-tool-card" href="#/tools/treatment-comparison"><span class="r3-orbmark">≋</span><div class="r3-bento-copy"><span>SMART TOOL</span><h3>مقایسه درمان‌ها</h3><p>برای فهم تفاوت‌ها، نه انتخاب درمان به جای پزشک.</p></div></a>
        <a class="r3-bento-card r3-ai-card" href="#/ai-info"><span class="r3-orbmark">✦</span><div class="r3-bento-copy"><span>SAFE AI</span><h3>راهنمای هوشمند ایمن</h3><p>راهنمای سایت و آموزش عمومی؛ نه تشخیص، نسخه یا دوز دارو.</p></div></a>
      </section>

      <section class="section" id="r3-services">
        <div class="r3-section-title"><div><span class="r3-overline">TREATMENTS</span><h2>خدمات، با روایت بصری مجزا</h2></div><a href="#/services" class="r3-textlink">مشاهده همه ←</a></div>
        <div class="r3-service-rail">${services.map((s,i)=>`<a class="r3-service-tile" href="#/services/${s.slug}" style="--delay:${i*35}ms"><img src="${A+s.img}" alt=""><div class="r3-service-gradient"></div><div class="r3-service-meta"><span>0${i+1}</span><h3>${s.title}</h3><p>${s.desc}</p></div></a>`).join('')}</div>
      </section>

      <section class="r3-journey section">
        <div class="r3-section-title"><div><span class="r3-overline">JOURNEY</span><h2>پنج نقطهٔ تماس، یک تجربه</h2></div>${btn('جزئیات مسیر','/experience/patient-journey')}</div>
        <div class="r3-timeline">
          ${[
            ['01','شناخت','خدمت مناسب را پیدا کن، بدون تشخیص آنلاین.'],
            ['02','مقایسه','گزینه‌ها را آموزشی کنار هم ببین.'],
            ['03','درخواست','فرم و Validation واقعی؛ ثبت پس از Backend.'],
            ['04','درمان','طرح درمان و رضایت آگاهانه در مسیر کلینیکی.'],
            ['05','پیگیری','My Mina و Aftercare پس از اتصال حساب.']
          ].map((x,i)=>`<div class="r3-time-item"><div class="r3-time-node"><span>${x[0]}</span></div><div><b>${x[1]}</b><p>${x[2]}</p></div>${i<4?'<i></i>':''}</div>`).join('')}
        </div>
      </section>

      <section class="r3-trust section">
        <div class="r3-trust-copy"><span class="r3-overline">TRUTH LAYER</span><h2>اعتماد از «ادعا» نمی‌آید؛ از <em>شفافیت</em> می‌آید.</h2><p>در این Preview هر چیزی که هنوز دادهٔ واقعی یا Backend ندارد، واضحاً Gate شده است. این یعنی ظاهر پیشرفته بدون فریب عملکردی.</p>${btn('وضعیت واقعی سرویس‌ها','/status','primary')}</div>
        <div class="r3-trust-grid">
          <div class="r3-trust-item ok"><span>✓</span><b>UI / Route / Interaction</b><small>قابل تست در Preview</small></div>
          <div class="r3-trust-item wait"><span>○</span><b>Address / Hours / Pricing</b><small>نیازمند تأیید مالک</small></div>
          <div class="r3-trust-item block"><span>×</span><b>OTP / Payment / Booking</b><small>Production هنوز متصل نیست</small></div>
          <div class="r3-trust-item ok"><span>✓</span><b>Visual QA Map</b><small>تمام Routeها قابل بازبینی</small></div>
        </div>
      </section>
    `;
  };

  window.servicesHub = function servicesR3(){
    return pageHero('مرکز خدمات','هر خدمت صفحهٔ مستقل، تصویر اختصاصی و مسیر اقدام خودش را دارد.', '<span class="r3-route-badge">07 SERVICE ROUTES</span>') + `
      <section class="r3-service-index section">
        <div class="r3-service-index-head"><div><span class="r3-overline">DISCOVER</span><h2>بر اساس نیاز، نه منوی پیچیده</h2></div><button class="btn" onclick="document.getElementById('searchBtn').click()">⌕ جست‌وجو</button></div>
        <div class="r3-service-rail r3-service-grid">${services.map((s,i)=>`<a class="r3-service-tile" href="#/services/${s.slug}"><img src="${A+s.img}" alt=""><div class="r3-service-gradient"></div><div class="r3-service-meta"><span>0${i+1}</span><h3>${s.title}</h3><p>${s.desc}</p></div></a>`).join('')}</div>
      </section>
      <section class="r3-callout section"><div><span class="r3-overline">NOT SURE?</span><h2>نمی‌دانی از کجا شروع کنی؟</h2><p>مقایسه درمان و Patient Journey برای همین ساخته شده‌اند.</p></div><div class="actions">${btn('مقایسه درمان','/tools/treatment-comparison','primary')}${btn('مسیر بیمار','/experience/patient-journey')}</div></section>`;
  };

  window.experience = function experienceR3(){
    return pageHero('تجربه بیمار','لایه‌ای که قبل، حین و بعد از درمان باید ابهام را کم کند.', '<span class="r3-route-badge">PATIENT EXPERIENCE</span>') + `
      <section class="r3-experience-grid section">
        <a href="#/experience/online-consultation" class="r3-exp-card"><span>01</span><h3>مشاوره آنلاین</h3><p>UX واقعی فرم، Validation و وضعیت شفاف اتصال.</p><i>↗</i></a>
        <a href="#/experience/cost-estimate" class="r3-exp-card"><span>02</span><h3>تخمین هزینه</h3><p>منطق پرسشنامه بدون نمایش عدد ساختگی.</p><i>↗</i></a>
        <a href="#/experience/patient-journey" class="r3-exp-card"><span>03</span><h3>Patient Journey</h3><p>قدم‌های مراجعه با زبان قابل فهم برای بیمار.</p><i>↗</i></a>
        <a href="#/portal" class="r3-exp-card accent"><span>04</span><h3>My Mina</h3><p>ساختار پورتال بیمار با Gate روشن Backend.</p><i>↗</i></a>
      </section>`;
  };

  function installQAInspector(){
    if(document.getElementById('r3QaDock')) return;
    const dock=document.createElement('div');
    dock.id='r3QaDock'; dock.className='r3-qa-dock';
    dock.innerHTML=`<button id="r3QaToggle" aria-label="باز کردن ابزار QA">QA</button><div class="r3-qa-panel" id="r3QaPanel"><div class="r3-qa-head"><b>Visual Inspector</b><button id="r3QaClose">×</button></div><div class="r3-qa-row"><span>Route</span><code id="r3QaRoute">/</code></div><div class="r3-qa-row"><span>Viewport</span><code id="r3QaViewport"></code></div><div class="r3-qa-row"><span>Network</span><code id="r3QaNet">${navigator.onLine?'online':'offline'}</code></div><div class="r3-qa-actions"><button id="r3Grid">Grid</button><button id="r3Contrast">Contrast</button><button id="r3CopyIssue">Copy issue</button><a href="#/qa">All routes</a></div><p>این ابزار فقط برای پیدا کردن ایراد بصری است و داده‌ای ارسال نمی‌کند.</p></div>`;
    document.body.appendChild(dock);
    const panel=document.getElementById('r3QaPanel');
    document.getElementById('r3QaToggle').onclick=()=>panel.classList.toggle('open');
    document.getElementById('r3QaClose').onclick=()=>panel.classList.remove('open');
    document.getElementById('r3Grid').onclick=()=>document.body.classList.toggle('r3-grid-on');
    document.getElementById('r3Contrast').onclick=()=>document.body.classList.toggle('r3-contrast');
    document.getElementById('r3CopyIssue').onclick=async()=>{
      const route=(location.hash.slice(1)||'/');
      const text=`MinaDental R3 QA\nRoute: ${route}\nViewport: ${innerWidth}x${innerHeight}\nIssue: `;
      try{await navigator.clipboard.writeText(text);document.getElementById('r3CopyIssue').textContent='Copied ✓';setTimeout(()=>document.getElementById('r3CopyIssue').textContent='Copy issue',1200)}catch(e){prompt('متن گزارش را کپی کن:',text)}
    };
    function sync(){document.getElementById('r3QaRoute').textContent=location.hash.slice(1)||'/';document.getElementById('r3QaViewport').textContent=`${innerWidth}×${innerHeight}`}
    addEventListener('resize',sync,{passive:true}); addEventListener('hashchange',sync); addEventListener('online',()=>document.getElementById('r3QaNet').textContent='online'); addEventListener('offline',()=>document.getElementById('r3QaNet').textContent='offline'); sync();
  }

  function installProgress(){
    const el=document.createElement('div'); el.className='r3-scroll-progress'; document.body.appendChild(el);
    const update=()=>{const d=document.documentElement;const max=d.scrollHeight-innerHeight;el.style.transform=`scaleX(${max>0?scrollY/max:0})`};
    addEventListener('scroll',update,{passive:true}); addEventListener('resize',update,{passive:true}); update();
  }

  function enhanceRoute(){
    document.body.dataset.route=(location.hash.slice(1)||'/').replace(/[^a-z0-9-]/gi,'-');
    document.querySelectorAll('.r3-service-tile,.r3-bento-card,.r3-exp-card').forEach((el,i)=>{el.style.setProperty('--i',i);el.classList.add('r3-reveal')});
    requestAnimationFrame(()=>document.querySelectorAll('.r3-reveal').forEach(el=>el.classList.add('is-in')));
  }

  const baseRender=window.render;
  window.render=function renderR3(){baseRender(); enhanceRoute();};
  window.addEventListener('hashchange',enhanceRoute);
  installQAInspector(); installProgress();
  window.render();
})();