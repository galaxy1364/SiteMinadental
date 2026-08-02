(() => {
  'use strict';

  async function loadData(){
    const response=await fetch(`./content-data.json?v=${Date.now()}`,{cache:'no-store'});
    if(!response.ok)throw new Error(`Content HTTP ${response.status}`);
    return response.json();
  }

  function style(){
    if(document.getElementById('mina-content-style'))return;
    const el=document.createElement('style');el.id='mina-content-style';el.textContent=`
      .mina-content{padding:56px 16px;direction:rtl;font-family:inherit;background:linear-gradient(180deg,#fff,#f8fafc)}.mina-content-wrap{max-width:1180px;margin:auto}.mina-content-head{text-align:center;margin-bottom:28px}.mina-content-head h2{font-size:clamp(26px,4vw,42px);margin:0 0 10px;color:#0f172a}.mina-content-head p{margin:0;color:#64748b;line-height:1.9}.mina-article-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px}.mina-article{background:#fff;border:1px solid #e2e8f0;border-radius:22px;overflow:hidden;box-shadow:0 10px 30px rgba(15,23,42,.06)}.mina-article img{width:100%;aspect-ratio:16/10;object-fit:cover;display:block}.mina-article-body{padding:16px}.mina-article small{color:#0d9488;font-weight:700}.mina-article h3{font-size:17px;line-height:1.8;margin:6px 0;color:#0f172a}.mina-article p{font-size:13px;line-height:1.9;color:#64748b;margin:0}.mina-gallery{display:grid;grid-template-columns:repeat(12,1fr);gap:10px;margin-top:34px}.mina-gallery figure{margin:0;border-radius:18px;overflow:hidden;min-height:180px;background:#e2e8f0}.mina-gallery figure:nth-child(6n+1),.mina-gallery figure:nth-child(6n+4){grid-column:span 7}.mina-gallery figure:nth-child(6n+2),.mina-gallery figure:nth-child(6n+3),.mina-gallery figure:nth-child(6n+5),.mina-gallery figure:nth-child(6n+6){grid-column:span 5}.mina-gallery img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .5s ease}.mina-gallery figure:hover img{transform:scale(1.03)}@media(max-width:700px){.mina-gallery figure{grid-column:span 12!important;min-height:220px}.mina-content{padding-bottom:90px}}
    `;document.head.appendChild(el);
  }

  function mount(data){
    if(document.getElementById('mina-content-hub'))return;
    style();const section=document.createElement('section');section.id='mina-content-hub';section.className='mina-content';section.setAttribute('aria-labelledby','mina-content-title');
    section.innerHTML=`<div class="mina-content-wrap"><div class="mina-content-head"><h2 id="mina-content-title">مجله سلامت دهان و لبخند</h2><p>مطالب آموزشی برای تصمیم‌گیری آگاهانه‌تر؛ انتشار نهایی مقالات پزشکی پس از بازبینی پزشک انجام می‌شود.</p></div><div class="mina-article-grid"></div><div class="mina-gallery" aria-label="گالری کلینیک و خدمات"></div></div>`;
    const articles=section.querySelector('.mina-article-grid');
    for(const item of data.articles||[]){const card=document.createElement('article');card.className='mina-article';card.innerHTML=`<img src="./${item.image}" alt="${item.title}" loading="lazy"><div class="mina-article-body"><small>${item.category}</small><h3>${item.title}</h3><p>${item.summary}</p></div>`;articles.appendChild(card);}
    const gallery=section.querySelector('.mina-gallery');
    for(const item of (data.gallery||[]).filter(x=>x.verified!==false)){const fig=document.createElement('figure');fig.innerHTML=`<img src="./${item.src}" alt="${item.alt}" loading="lazy" decoding="async">`;gallery.appendChild(fig);}
    const footer=document.querySelector('footer');(footer?.parentNode||document.body).insertBefore(section,footer||null);
  }

  async function init(){try{mount(await loadData());}catch(error){console.warn('Content hub unavailable',error);}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
