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

**Truth:** Root هنوز Runtime قدیمی `2026.08.05.1` است. V9/Enterprise runtime تا زمان deploy واقعی، Domain verification و backend evidence نباید Live/Production 10/10 نامیده شود.

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

`config.js` Secret ندارد، روی Root قبل از Runtime لود می‌شود و Service Worker آن را cache نمی‌کند تا تغییر Owner Truth قدیمی نماند.

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
2. **V9 production integrity gate** — تا V9 واقعاً روی Root نیست عمداً FAIL می‌ماند.
3. **CodeQL JavaScript analysis** — مستقل اجرا می‌شود.

Current Root Hardening checks:
- `config.js`, `path-fix.js`, `site-hardening.js`, `pwa-runtime.js`, `sw.js` syntax
- owner-truth gates
- نبود owner data تأییدنشده در root metadata/config/manifest
- runtime Truth Guard presence
- config no-cache
- privacy-safe PWA state preservation
- sensitive `api/portal/admin` cache exclusion

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

## 14) Current Hardening Log — 2026-09-03

### DONE — Root / Truth / Privacy
- README از فایل حداقلی به **MASTER GOVERNANCE / TRUTH LOCK** ارتقا یافت.
- Root `index.html` بدون تغییر React visual bundle، metadata/JSON-LD را از آدرس دقیق، ساعت، مختصات، تلفن، ایمیل، Social، price/payment و claimهای تأییدنشده پاک کرد.
- `manifest.webmanifest` از `/SiteMinadental/` hard-code به URLهای relative تبدیل و shortcut عملیاتی رزرو حذف شد.
- `path-fix.js` base را از Script URL مشتق می‌کند؛ custom domain دیگر به `/SiteMinadental` قفل نیست.
- `pwa-runtime.js` base پویا دارد؛ ذخیره ضمنی همه فرم‌ها حذف شد و فقط `data-pwa-preserve="true"` opt-in قابل نگهداری است.
- Install Prompt خودکار حذف و به `window.MinaPWA` user-driven تبدیل شد.
- `sw.js` base پویا گرفت؛ `api/`, `portal/`, `admin/`, `admin.html`, `version.json`, `sw.js`, `config.js` cache نمی‌شوند.
- فرم‌های appointment/contact دیگر به WhatsApp hard-coded اطلاعات ارسال نمی‌کنند؛ UI validation باقی مانده ولی صریح می‌گوید هیچ نوبت/پیامی ثبت یا ارسال نشده است.
- Truth Guard روی UI واقعی اضافه شد:
  - phone/email/address/hours legacy به حالت owner-gated تبدیل می‌شوند
  - WhatsApp/Telegram/Instagram/email/phone قدیمی غیرفعال می‌شوند
  - Map iframe/buttons تا تأیید Map Pin gate می‌شوند
  - stats ساختگی، Before/After بدون consent و Testimonials نمونه با Evidence-gated replacement جایگزین می‌شوند
  - claimهای مدرک/تجهیزات/ضمانت/بیمه/اقساط/rank/24h/نتیجه قطعی sanitize می‌شوند
- `config.js` به‌عنوان Single Public Truth Source ساخته و روی Root قبل از runtime لود شد.
- `config.js` runtime flags دارد: forms/booking/OTP/payments/domain verification = false.

### DONE — CI Evidence
- CodeQL برای Commit Truth Guard `c275e6df44629dc3a41fd91b73348ab211952311` با Success تمام شد.
- Enterprise Security workflow به دو Gate جدا تفکیک شد: Current Root Hardening و V9 Production Gate.
- Run `33819217461`: JavaScript syntax = PASS، Owner-Truth contract = PASS، Privacy/PWA contract = PASS.
- V9 Production Gate در همان Run باید تا زمان مهاجرت واقعی FAIL باقی بماند؛ این Failure Regression محسوب نمی‌شود.

### IMPORTANT CONTAINMENT TRUTH
- Minified legacy React bundle `assets/index-ClUC_4GS.js` هنوز رشته‌های قدیمی/تأییدنشده را در **Source** دارد.
- Truth Guard آن‌ها را در UI فعلی مهار می‌کند، اما این وضعیت راه‌حل نهایی معماری نیست.
- گام نهایی باید Build تمیز و یکپارچه با Visual DNA فعلی + R3 + Enterprise/V9 باشد تا claimهای legacy از Source نیز حذف شوند؛ Patch runtime نباید برای همیشه معماری نهایی بماند.

### EVIDENCE / COMMITS
- Master Governance: `67fd5f85fdb2337ec6c76fad959b6273e246ef1d`
- Root truth metadata: `0c4b89cec39d96d27118842a090706763a5598dc`
- Manifest portable/truth-safe: `889c37f69df3611455410a0c44d91b08f22bf7ec`
- PWA privacy/base: `88745f61dbdf37ce4eef1d9897f4af45628350df`
- SW cache hardening: `5b523bb7bdad4f8177b796925f01f9dfad64a827`
- Block unverified WhatsApp form forwarding: `877c35061ff772e3d8d10e05c44222eea2c5ed57`
- Dynamic asset base: `21cda7a8fe863dd2641cba10d8a4498d4dcab419`
- Runtime Truth Guard: `c275e6df44629dc3a41fd91b73348ab211952311`
- Root JS syntax pre-gate: `26afbf33d146e398380a9f467fb8ac3b3a93c001`
- Public Truth Config create: `5a4bff555aa204e6a1f8b83edb744ac8ec92b971`
- Root loads config: `7e6170c2c6c545939827ce8598ff8481cccf7136`
- SW config no-cache: `b39201cbd8193e4028954b90178302643aa9559c`
- CI current-root/V9 split: `36cc64aea8a1e7de7ca43c976cb300acd9149a05`
- CI truth-gate rule fix: `82987b14e7f250b77b96615f3eb8ae7722504d5c`
- Root truth contract marker: `196f1f06386f71959b374af3a9cee71471f9595d`
- Config runtime gate state: `10ef92df16e17f425080190574cf500a26f14b5c`

## 15) Immediate Priority Queue

1. ✅ Root containment hardening + canonical Owner Truth Config + independent CI evidence
2. 🟡 Clean-source integration: preserve current Premium Visual DNA, merge R3 + Enterprise/V9, remove legacy claims from source (no regression)
3. 🟡 Complete Global Enterprise Audit browser/Lighthouse/WCAG/ZAP evidence
4. ⬜ remove staging remnants only after dependency audit
5. ⬜ verify/connect existing Cloudflare Production project + `minadentalclinic.ir`
6. ⬜ Supabase/Auth/RLS/OTP/Turnstile
7. ⬜ real Booking/Recall/Waitlist/Payments
8. ⬜ Owner truth-data ingestion into `config.js`/backend
9. ⬜ real-device accessibility + field performance + restore drill + pentest
10. ⬜ Production 10/10 only after all Evidence gates

## 16) NOT CLAIMED

- V9/Enterprise runtime is **not** claimed live on Production.
- `minadentalclinic.ir` is **not** claimed verified until direct Cloudflare/domain evidence exists.
- Booking/OTP/Payment/Portal backend are **not** claimed operational.
- WCAG human/device PASS, field CWV PASS, backup/restore PASS and pentest PASS are **not** claimed.

---

**Project Truth:** طراحی عالی + قابلیت واقعی + امنیت + شفافیت + Evidence = Enterprise. هیچ‌کدام به‌تنهایی کافی نیست.