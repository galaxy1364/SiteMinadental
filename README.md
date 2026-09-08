# SiteMinadental — MASTER GOVERNANCE / TRUTH LOCK

> این README تنها سند مادر پروژه است. هر Executor/AI/Developer قبل از تغییر سایت باید این فایل را بخواند و همین فایل را درجا به‌روزرسانی کند. ساخت سند مادر موازی، نسخه/Repo/سایت موازی یا بازنویسی از صفر ممنوع است مگر مالک صریحاً دستور دهد.

## 1) هدف نهایی

ساخت و نگهداری وب‌سایت عمومی دندانپزشکی دکتر مینا مازندرانی به‌عنوان یک تجربه دیجیتال فارسی‌محور، فوق‌حرفه‌ای، متمایز، مدرن، هوشمند، تبلیغاتی و Enterprise واقعی؛ با طراحی ممتاز، UX بیمارمحور، امنیت، حریم خصوصی، دسترس‌پذیری، SEO/AI discovery، PWA، SRE/observability و قابلیت‌های عملیاتی واقعی.

**اصل:** Enterprise بودن هرگز به معنی ساده‌کردن ظاهر نیست. هویت بصری Premium باید هم‌زمان با امنیت، سرعت، دسترس‌پذیری و هوشمندی ارتقا پیدا کند.

## 2) قانون اجرای اجباری

`AUDIT → OWNERSHIP → GAP → IMPLEMENT → TEST → FIX → RETEST → EVIDENCE → TRUTH LOCK → NEXT GAP`

ممنوع:
- ساخت از نو یا نسخه/Repo/سایت موازی بدون اجازه صریح مالک
- حذف قابلیت سالم برای راحتی توسعه
- mock/demo/fake-success برای قابلیت عملیاتی
- ادعای PASS یا Production 10/10 بدون Evidence
- داده ساختگی: آدرس، ساعت، قیمت، مختصات، مدارک، تجهیزات، بیمه، ضمانت، Review، Rating، Social، آمار بیمار/رضایت
- Secret در Front-end
- تغییر پنهان یا بدون ثبت

اگر Evidence کافی نیست: `STOP_BLOCKER`.

## 3) خط اصلی پروژه

- Repository: `galaxy1364/SiteMinadental`
- Branch: `main`
- Target Production Domain: `https://minadentalclinic.ir/`
- Current public GitHub Pages root: `https://galaxy1364.github.io/SiteMinadental/`
- Visual/UX Acceptance Preview R3: `https://galaxy1364.github.io/SiteMinadental/preview-r2/`
- Audit Center: `#/audit`
- Visual QA: `#/qa`

**Truth:** Root public هنوز تا زمان عبور کامل clean-source audit، domain verification و backend evidence نباید Live/Production 10/10 نامیده شود.

## 4) Single Public Truth Source

`config.js` تنها منبع عمومی Owner-verified برای داده‌هایی است که باید بعداً در UI/SEO/Maps/Contact فعال شوند.

فعلاً این Gateها `false/null` هستند:
- exact address / map pin / hours
- phone / email / social
- credentials / equipment
- insurance / financing / pricing
- reviews / before-after consent
- booking / OTP / payments / operational forms
- production-domain verification

`config.js` Secret ندارد و Service Worker نباید آن را cache کند تا تغییر Owner Truth قدیمی نماند.

## 5) Design / UX Lock

باید حفظ و تقویت شود:
- Premium / cinematic clinical visual direction
- تصاویر واقعی خود پروژه، نه stock/competitor template
- RTL فارسی واقعی و Mobile-first
- Hero تصویری حرفه‌ای، depth، glass/gradient کنترل‌شده
- Bento / storytelling / scrollytelling
- Native-app-like mobile dock
- visual treatment مستقل برای Serviceها
- micro-interactions + `prefers-reduced-motion`
- loading / empty / error / success / blocked states
- truthful backend-gated states
- QA inspector برای Route/Viewport/Visual defects

## 6) Capability Target

### Patient Platform
- Services + independent treatment routes
- Smart Persian Search
- Patient Journey
- Treatment Comparison
- Cost Estimate بدون عدد ساختگی
- Online Consultation
- Dental Emergency education
- My Mina Portal
- Family profiles / Intake / Documents
- Treatment plan + e-sign evidence
- Aftercare / Clinical published view
- Finance / ledger / installments
- Virtual visit readiness
- Recall / Smart Waitlist
- Review/NPS/CSAT / Referral

### AI
- AI Concierge فقط navigation/education
- RAG فقط از محتوای تأییدشده
- citation / provenance / confidence / human handoff
- ممنوعیت تشخیص قطعی، تجویز و دوز دارو
- prompt-abuse/red-team قبل از Production AI

### Iran-local
- Iran mobile normalization +98
- Jalali UI + standard backend timestamp
- Neshan/Balad after verified Map Pin
- real SMS/OTP provider
- real PSP/payment provider
- weak 3G/4G Iran field testing

## 7) Global Standards Baseline

- WCAG 2.2 AA + human VoiceOver/TalkBack/Keyboard/Zoom/Focus/Target Size
- Core Web Vitals field p75: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1
- OWASP Top 10 + ASVS 5.0.0
- NIST CSF 2.0
- NIST AI RMF + GenAI Profile
- ISO/IEC 42001 mapping when AI is operational
- CodeQL SAST
- DAST/ZAP baseline
- Secret leak guard
- Dependency/supply-chain controls
- SBOM CycloneDX/SPDX target
- Google Search Essentials / people-first / structured-data truthfulness
- Medical editorial workflow: Author → Medical Review → Approve → Publish → Review Date → Revision History
- OpenTelemetry target for logs/metrics/traces
- Backup/Restore drill + RPO/RTO
- Independent pentest before Production 10/10

هیچ Badge/Compliance claim بدون applicability و evidence مجاز نیست.

## 8) CI / Audit Truth

### Enterprise Security workflow
سه حقیقت جدا دارد:
1. **Current root hardening evidence** — باید PASS شود.
2. **Production integrity gate** — تا clean-source production runtime و domain/provider evidence کامل نیست عمداً FAIL می‌ماند.
3. **CodeQL JavaScript analysis** — مستقل اجرا می‌شود.

### Global Enterprise Audit
هدف:
- JS syntax
- HTML validation
- asset/truth contract
- real Chromium route smoke tests
- mobile horizontal overflow
- Lighthouse evidence
- Pa11y/WCAG automated evidence
- OWASP ZAP DAST evidence

قانون: Failure باید اصلاح شود؛ خاموش‌کردن Validator برای چراغ سبز ممنوع است مگر Rule واقعاً نامربوط باشد و دلیل ثبت شود.

## 9) Truth-gated Owner/Provider Inputs

تا تأیید واقعی، نمایش قطعی ممنوع:
- آدرس دقیق / ساعات / Map Pin / lat-lon
- تلفن / ایمیل / Social handles
- مدارک، عنوان حرفه‌ای و رزومه دقیق
- تجهیزات/تکنولوژی‌ها
- بیمه / financing / warranty
- pricing/ranges
- Before/After بدون consent
- Reviews/Ratings/Awards

## 10) Production Infrastructure Gates

- Cloudflare project/domain/Worker/headers/WAF/Turnstile/rate limiting
- Supabase Production schema + RLS + auth
- OTP/recovery/abuse controls
- Admin MFA/AAL2/Passkeys
- payment callbacks/idempotency/reconciliation/refund
- OpenTelemetry/RUM/alerts/SLO
- backup/restore drill + RPO/RTO
- Search Console / sitemap / URL inspection
- field Core Web Vitals
- manual accessibility device testing
- independent pentest

## 11) Current Preview R3

Preview R3 `noindex,nofollow` است و برای Acceptance بصری/UX است:
- cinematic Home
- service storytelling
- Experience hub
- My Mina acceptance UI
- search / comparison / cost / consultation validation
- AI safety demo
- Privacy / Status / Accessibility / Guides / QA
- Enterprise Audit Center
- truthful backend-blocked states

Preview نباید به‌عنوان Production data/system معرفی شود.

## 12) Lovable Status

Lovable Workspace/Project متصل است اما workspace credit ندارد و MinaVision build واقعی تکمیل نشده؛ فایل اصلی Lovable هنوز Blank Placeholder بوده است. Lovable تا بازگشت Credit `BLOCKED` است. پس از Credit باید **همان Project موجود** ادامه یابد؛ پروژه Lovable جدید موازی ممنوع است.

## 13) Persistence / Change Contract

1. همین README سند مادر و حافظه اجرایی پروژه است.
2. هر تغییر مهم Done/Gap/Blocked و Evidence را همین‌جا ثبت می‌کند.
3. کد سالم بدون Evidence حذف نمی‌شود.
4. هر Deploy باید commit/version/evidence قابل ردیابی داشته باشد.
5. Preview محل Acceptance است؛ Root فقط با Gate مناسب ارتقا می‌یابد.
6. Rollback path قبل از تغییر پرریسک مشخص می‌شود.
7. Success عملیاتی بدون server/backend evidence ممنوع است.
8. `config.js` مرجع واحد Owner Truth عمومی است؛ Secret هرگز وارد آن نمی‌شود.

## 14) Historical Hardening Summary

### DONE — Root / Truth / Privacy
- Root legacy metadata از آدرس دقیق، ساعت، مختصات، تلفن، ایمیل، Social، price/payment و claimهای تأییدنشده پاک شد.
- PWA/SW privacy hardening انجام شد و `api/`, `portal/`, `admin/`, `version.json`, `sw.js`, `config.js` از cache حساس خارج شدند.
- فرم‌های قدیمی hard-coded به WhatsApp مسدود شدند.
- Truth Guard برای containment legacy ایجاد شد.
- `config.js` به‌عنوان Single Public Truth Source ایجاد شد.

### DONE — CI Evidence
- CodeQL و Current Root Hardening در چندین commit PASS شده‌اند.
- Enterprise Security workflow بین current-root و production-gate تفکیک شده است.
- Global Enterprise Audit شامل HTML validation، browser smoke، Lighthouse، WCAG و ZAP است.

### IMPORTANT CONTAINMENT TRUTH
- Minified legacy React bundle `assets/index-ClUC_4GS.js` هنوز رشته‌های قدیمی/تأییدنشده را در Source دارد.
- Truth Guard آن‌ها را در UI legacy مهار می‌کند، اما معماری نهایی باید clean-source باشد و Root دیگر به آن bundle وابسته نماند.

## 15) Immediate Priority Queue

1. ✅ Root containment hardening + canonical Owner Truth Config + independent CI evidence
2. 🟡 Clean-source integration: preserve current Premium Visual DNA, merge R3 + Enterprise/V9, remove legacy claims from active source (no regression)
3. 🟡 Complete Global Enterprise Audit browser/Lighthouse/WCAG/ZAP evidence
4. ⬜ remove staging remnants only after dependency audit
5. ⬜ verify/connect existing Cloudflare Production project + `minadentalclinic.ir`
6. ⬜ Supabase/Auth/RLS/OTP/Turnstile
7. ⬜ real Booking/Recall/Waitlist/Payments
8. ⬜ Owner truth-data ingestion into `config.js`/backend
9. ⬜ real-device accessibility + field performance + restore drill + pentest
10. ⬜ Production 10/10 only after all Evidence gates

## 16) NOT CLAIMED

- Clean-source runtime is **not** claimed Production-ready until CI and production gates pass.
- `minadentalclinic.ir` is **not** claimed verified until direct Cloudflare/domain evidence exists.
- Booking/OTP/Payment/Portal backend are **not** claimed operational.
- WCAG human/device PASS, field CWV PASS, backup/restore PASS and pentest PASS are **not** claimed.
- رتبه ۱ یا Top 3 در Google/AI Search **تضمین نمی‌شود**؛ فقط technical SEO, structured data truthfulness, crawlability, performance و people-first content به‌صورت measurable اجرا می‌شوند.

## 17) Recovery + Governance Log — 2026-09-06

### 🔴 V9 HISTORICAL RECOVERY — BLOCKED WITH EVIDENCE
- `.v9latest` current 12-part payload truncated است و exact 69-file runtime بازیابی نشده است.
- Historical snapshots مستقل بررسی شدند و هیچ snapshot معتبری همه 69 hash authoritative را بازتولید نکرد.
- cross-generation stitching ممنوع و انجام نشده است.
- historical V9 payload/manifest/staging remnants برای forensic evidence نگه داشته می‌شوند و تا dependency/recovery closure حذف نمی‌شوند.
- `minadentalclinic-v9-visual-preview.html` فقط capability/UX reference است و به دلیل owner/provider claims تأییدنشده deployable Production truth نیست.

### ✅ ROOT GOVERNANCE CAPABILITY — IMPLEMENTED
- `privacy.html`, `accessibility.html`, `status.html`, `ai-transparency.html`, `editorial-governance.html` به‌عنوان truthful public governance surfaces موجودند.
- CI syntax/truth/accessibility/link contracts برای این سطوح برقرار است.

## 18) CLEAN-SOURCE RECONSTRUCTION — ACTIVE (2026-09-06)

### Owner authorization
مالک دستور صریح برای تکمیل صفر تا صد سایت، اجرای واقعی، افزودن امکانات لازم، جست‌وجوی استانداردهای روز و تست واقعی داده است. این مجوز فقط برای **in-place reconstruction در همین Repo/Branch** تفسیر می‌شود؛ ساخت Repo/سایت موازی، جعل Provider یا روشن‌کردن capability بدون evidence همچنان ممنوع است.

### Rollback point
- Pre-reconstruction HEAD: `71134a9c0a092b114d7b1adf39e1cd2b08d8a379`
- Pre-reconstruction tree: `b89b2a401fa99aa8f54d55060dd4c415c8a70876`
- Force update ممنوع؛ هر commit باید fast-forward و traceable باشد.

### Local reconstruction evidence before first write
- 30 HTML pages generated in clean-source working tree.
- JavaScript syntax: PASS.
- HTML structure (`lang=fa`, `dir=rtl`, `main`, exactly one `h1`, meta description): PASS on all generated pages.
- XML parse (`sitemap.xml`, `feed.xml`, `opensearch.xml`): PASS.
- JSON parse (`manifest.webmanifest`, `version.json`): PASS.
- internal-link audit: initially found one wrong portal path; fixed; retest PASS with 0 unresolved generated/known-root links.
- local Chromium execution in current container is `NOT_MEASURED_YET` because the container Chromium process hangs on D-Bus/mojo; browser truth must therefore come from existing GitHub Actions Playwright/Lighthouse/Pa11y gate after publish, not be claimed locally.

### Clean-source core integration
- Orphan prototype commits `0edb41558145f50768672fa7c7d6ecd246c40508` and `3fea88f0f7717b83d491904c2c3113eb89b2af98` were never attached to `main`; they are forensic-only and not release commits.
- Final clean-source core integration commit is `fc929416c15a44fec2db74401b43e87a046e7410`, created as a direct child of the then-current documented `main` HEAD with no force operation.
- Added `assets/css/site.css` with premium RTL/mobile-first design, focus/reduced-motion/contrast/print handling and reserved hero dimensions to reduce CLS.
- Added `assets/js/site.js` with Persian-normalized search, accessible menu/dialog behavior, owner-gated state hooks and portable GitHub Pages/custom-domain base resolution.
- Added `_worker.js` with real `/api/health` and `/api/capabilities` truth responses; all unconfigured `/api/*` operations return `503 CAPABILITY_NOT_CONFIGURED` instead of fake success.
- Added `_headers`/`_redirects`, `.well-known/security.txt`, truthful offline/404 surfaces, `llms.txt`, `humans.txt`, `opensearch.xml`.
- HSTS/CSP in `_headers` are Cloudflare-deployment controls only; Cloudflare Production deploy remains blocked until HTTPS/domain verification. `style-src 'unsafe-inline'` is currently required by generated static page style attributes and must be removed before final ASVS/CSP hardening if inline styles are eliminated.

### Standards evidence used for reconstruction
- Google Search 2026: no special AEO/GEO markup/file is required for AI Overviews/AI Mode; foundational SEO, crawlability, textual content, useful original content, valid structured data, Search Console and Business Profile remain the supported path.
- Google explicitly states ranking/indexing/AI inclusion is not guaranteed even when best practices are followed.
- Core Web Vitals target remains p75 LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1.
- WCAG 2.2 AA remains target; new 2.2 requirements such as Focus Not Obscured, Target Size Minimum and Accessible Authentication are applicable.
- OWASP ASVS stable baseline is 5.0.0.
- Turnstile requires server-side token validation; client-only CAPTCHA success is not accepted.

### Current execution state
- **DONE:** read-only source audit, truth/config audit, V9 recovery audit, latest CI audit, Supabase project discovery read-only, standards refresh, clean-source local generation/syntax/structure/link tests, clean-source core commit prepared as fast-forward child.
- **NEXT:** fast-forward `main` from `4da5696884a907ba1dfb565ac700f23f1871170a` to `fc929416c15a44fec2db74401b43e87a046e7410` with `force=false`; then add static content routes, update CI contracts, switch Root and run real GitHub Pages browser/Lighthouse/WCAG/ZAP evidence.
- **BLOCKED EXTERNAL:** custom production domain/Cloudflare secret evidence, dedicated public-site backend ownership decision, real OTP/SMS provider, Turnstile keys, PSP/payment provider, Search Console/Business Profile ownership, VAPID/push provider, live AI provider, owner-verified clinic details/media/claims, real-device/field tests, independent pentest.

### Forbidden now
- Do not connect the existing `minadent-production` Supabase clinical-management database to the public website merely because it is active; evidence does not establish it as the public-site backend and it contains sensitive clinic/patient-domain tables.
- Do not flip `config.js` operational flags to true without end-to-end provider evidence.
- Do not modify or delete historical `.v9*`, `.payload`, `exact-payload` forensic remnants before dependency/recovery closure.
- Do not claim Production 10/10 or Google Top 1/Top 3.

### Resume point
`CLEAN_SOURCE_PHASE_A_CORE_COMMIT_READY_FOR_NONFORCE_MAIN_REF`

---

**Project Truth:** طراحی عالی + قابلیت واقعی + امنیت + شفافیت + Evidence = Enterprise. هیچ‌کدام به‌تنهایی کافی نیست.

## 19) انتقال مجاز سورس سایت Work — ۲۰۲۶-۰۹-۰۸

مالک ایجاد شاخه انتقال و درخواست ادغام را برای نگهداری سورس فعلی Work در همین مخزن تایید کرد. مقصد انتقال `sites/dr-mina-mazandarani/` است؛ این پوشه snapshot قابل بازبینی از همان سایت موجود است، نه سایت جدید یا جایگزین runtime ریشه. README ریشه همچنان سند مادر این مخزن است؛ README داخل پوشه، سابقه شواهد سایت Work را نگه می‌دارد و مرجع جایگزین برای این مخزن نیست.

- Source project: `appgprj_6a73260c5d508191928f0f76466e48f0`
- Source revision: `2ce32ea23ed38a611fc4478eacd3c5ff4ff4f029`
- Source repository: مخزن Git سرویس Sites؛ تاریخچه اصلی آن حفظ شده است.
- GitHub base: `279839405e9e0056c5f90b5e98e1142ab6623a72`
- Snapshot: تمام ۴۴ فایل تحت Git، با مسیر نسبی و mode اصلی؛ hash هر blob پس از ارسال با hash سورس تطبیق داده شد. خروجی ساخت و وابستگی‌های نصب‌شده لازم برای بازیابی سورس نیستند؛ lockfile موجود است. فایل tsconfig.tsbuildinfo چون در سورس اصلی tracked بود بدون حذف منتقل شد.
- No deletion: همه فایل‌ها و درخت‌های قبلی GitHub حفظ می‌شوند؛ فقط این ثبت در README ریشه افزوده می‌شود.
- Validation: ساخت رسمی، هفت آزمون موجود و lint برای revision سورس در مرحله قبل موفق بودند؛ انتقال هیچ کد محصولی را تغییر نمی‌دهد و این شواهد معادل تست موبایل/E2E نیستند.
- Blockers: آزمون دیداری و موبایل، نصب واقعی، سرویس رزرو/AI و داده تاییدشده همچنان بازند. اتصال Supabase مدیریت، تغییر config.js ریشه و فعال‌کردن provider انجام نشده است.
- Publishing: این انتقال مجوز merge یا deploy نیست؛ هیچ سایت تازه‌ای منتشر نمی‌شود. workflowهای موجود شاهد سلامت runtime منتقل‌شده محسوب نمی‌شوند مگر به‌طور مشخص آن را آزموده باشند.
- Continuation: تغییرات بعدی همان سایت باید با ثبت Source revision و تطبیق hash در همین مسیر و همین شاخه/PR به‌روز شوند؛ همگام‌سازی خودکار پس‌زمینه راه‌اندازی نشده است. Push مستقیم ریشه سورس Sites روی main این مخزن ممنوع است چون ساختار و تاریخچه متفاوت‌اند.
- Resume: `RP-SITEMINADENTAL-WORK-SOURCE-TRANSFER-REVIEW-2026-09-08`
