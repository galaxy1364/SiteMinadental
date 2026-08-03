(() => {
  'use strict';

  async function loadData(){
    const response=await fetch(`./content-data.json?v=${Date.now()}`,{cache:'no-store'});
    if(!response.ok)throw new Error(`Content HTTP ${response.status}`);
    return response.json();
  }

  const esc=value=>String(value??'').replace(/[&<>"]/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[ch]));

  function style(){
    if(document.getElementById('mina-content-style'))return;
    const el=document.createElement('style');el.id='mina-content-style';el.textContent=`
      .mina-content{padding:56px 16px;direction:rtl;font-family:inherit;background:linear-gradient(180deg,#fff,#f8fafc)}.mina-content-wrap{max-width:1180px;margin:auto}.mina-content-head{text-align:center;margin-bottom:28px}.mina-content-head h2{font-size:clamp(26px,4vw,42px);margin:0 0 10px;color:#0f172a}.mina-content-head p{margin:0;color:#64748b;line-height:1.9}.mina-trust-note{margin:16px auto 30px;max-width:860px;padding:14px 16px;border:1px solid #cbd5e1;border-radius:18px;background:#fff;color:#475569;font-size:12px;line-height:2}.mina-service-grid,.mina-article-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:16px}.mina-service,.mina-article{background:#fff;border:1px solid #e2e8f0;border-radius:22px;overflow:hidden;box-shadow:0 10px 30px rgba(15,23,42,.06)}.mina-service img,.mina-article img{width:100%;aspect-ratio:16/10;object-fit:cover;display:block}.mina-card-body{padding:16px}.mina-card-kicker{color:#0d9488;font-weight:800;font-size:12px}.mina-card-title{font-size:17px;line-height:1.8;margin:6px 0;color:#0f172a}.mina-card-text{font-size:13px;line-height:1.95;color:#64748b;margin:0}.mina-card-meta{margin-top:12px;padding-top:10px;border-top:1px solid #eef2f7;color:#64748b;font-size:11px;line-height:1.8}.mina-faq{margin-top:12px}.mina-faq details{border-top:1px solid #eef2f7;padding:10px 0}.mina-faq summary{cursor:pointer;font-size:12px;font-weight:800;color:#334155}.mina-faq p{font-size:12px;line-height:1.9;color:#64748b}.mina-section-title{margin:42px 0 18px;font-size:24px;color:#0f172a}.mina-policy-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:12px}.mina-policy{background:#fff;border:1px solid #e2e8f0;border-radius:18px;padding:15px}.mina-policy h3{font-size:14px;margin:0 0 7px;color:#0f172a}.mina-policy p{font-size:12px;line-height:1.95;color:#64748b;margin:0}.mina-gallery{display:grid;grid-template-columns:repeat(12,1fr);gap:10px;margin-top:34px}.mina-gallery figure{margin:0;border-radius:18px;overflow:hidden;min-height:180px;background:#e2e8f0}.mina-gallery figure:nth-child(6n+1),.mina-gallery figure:nth-child(6n+4){grid-column:span 7}.mina-gallery figure:nth-child(6n+2),.mina-gallery figure:nth-child(6n+3),.mina-gallery figure:nth-child(6n+5),.mina-gallery figure:nth-child(6n+6){grid-column:span 5}.mina-gallery img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .5s ease}.mina-gallery figure:hover img{transform:scale(1.03)}@media(max-width:700px){.mina-gallery figure{grid-column:span 12!important;min-height:220px}.mina-content{padding-bottom:90px}}
    `;document.head.appendChild(el);
  }

  function serviceCard(item){
    const faq=(item.faq||[]).map(x=>`<details><summary>${esc(x.question)}</summary><p>${esc(x.answer)}</p></details>`).join('');
    return `<article class="mina-service"><img src="./${encodeURI(item.image)}" alt="${esc(item.title)}" loading="lazy" decoding="async"><div class="mina-card-body"><span class="mina-card-kicker">خدمت کلینیکی</span><h3 class="mina-card-title">${esc(item.title)}</h3><p class="mina-card-text">${esc(item.summary)}</p>${faq?`<div class="mina-faq">${faq}</div>`:''}</div></article>`;
  }

  function articleCard(item){
    const reviewer=item.medicalReviewer||'ثبت نشده';
    const status=item.status==='published'?'منتشرشده':'در انتظار بازبینی پزشکی';
    return `<article class="mina-article"><img src="./${encodeURI(item.image)}" alt="${esc(item.title)}" loading="lazy" decoding="async"><div class="mina-card-body"><span class="mina-card-kicker">${esc(item.category)}</span><h3 class="mina-card-title">${esc(item.title)}</h3><p class="mina-card-text">${esc(item.summary)}</p><div class="mina-card-meta">نویسنده: ${esc(item.author||'تیم محتوای کلینیک')}<br>بازبین پزشکی: ${esc(reviewer)}<br>وضعیت: ${esc(status)}</div></div></article>`;
  }

  function mount(data){
    if(document.getElementById('mina-content-hub'))return;
    style();const section=document.createElement('section');section.id='mina-content-hub';section.className='mina-content';section.setAttribute('aria-labelledby','mina-content-title');
    section.innerHTML=`<div class="mina-content-wrap"><div class="mina-content-head"><h2 id="mina-content-title">راهنمای خدمات و سلامت دهان</h2><p>اطلاعات شفاف برای تصمیم‌گیری آگاهانه‌تر پیش از مراجعه</p></div><div class="mina-trust-note">${esc(data.editorialPolicy?.diagnosisDisclaimer||'مطالب آموزشی جایگزین معاینه نیست.')}</div><h3 class="mina-section-title">خدمات قابل ارزیابی</h3><div class="mina-service-grid">${(data.services||[]).map(serviceCard).join('')}</div><h3 class="mina-section-title">مقالات آموزشی</h3><div class="mina-article-grid">${(data.articles||[]).map(articleCard).join('')}</div><h3 class="mina-section-title">سیاست‌های شفاف کلینیک</h3><div class="mina-policy-grid"></div><div class="mina-gallery" aria-label="گالری کلینیک و خدمات"></div></div>`;
    const policyLabels={pricing:'هزینه و طرح درمان',insurance:'بیمه',warranty:'پیگیری و نتیجه درمان',discount:'تخفیف',medicalEmergency:'شرایط اورژانسی'};
    const policies=section.querySelector('.mina-policy-grid');
    for(const [key,value] of Object.entries(data.policies||{})){const card=document.createElement('article');card.className='mina-policy';card.innerHTML=`<h3>${esc(policyLabels[key]||key)}</h3><p>${esc(value)}</p>`;policies.appendChild(card);}
    const gallery=section.querySelector('.mina-gallery');
    for(const item of (data.gallery||[]).filter(x=>x.verified===true)){const fig=document.createElement('figure');fig.innerHTML=`<img src="./${encodeURI(item.src)}" alt="${esc(item.alt)}" loading="lazy" decoding="async">`;gallery.appendChild(fig);}
    const footer=document.querySelector('footer');(footer?.parentNode||document.body).insertBefore(section,footer||null);
  }

  async function init(){try{mount(await loadData());}catch(error){console.warn('Content hub unavailable',error);window.minaDental?.emit?.('content_hub_error',{message:error?.message||'unknown'});}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
