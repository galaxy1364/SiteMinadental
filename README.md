# SiteMinadental — MASTER GOVERNANCE / TRUTH LOCK

> این README تنها سند مادر پروژه است. از این پس هر Executor/AI/Developer قبل از تغییر سایت باید این فایل را بخواند و همان را درجا به‌روزرسانی کند. ساخت سند مادر موازی، نسخه‌ی موازی، پروژه‌ی موازی یا بازنویسی از صفر ممنوع است مگر مالک صریحاً دستور دهد.

## 1) هدف نهایی

ساخت و نگهداری وب‌سایت عمومی دندانپزشکی دکتر مینا مازندرانی به‌عنوان یک تجربه دیجیتال فارسی‌محور، فوق‌حرفه‌ای، متمایز، مدرن، هوشمند، تبلیغاتی و Enterprise واقعی؛ با طراحی ممتاز، UX بیمارمحور، امنیت، حریم خصوصی، دسترس‌پذیری، SEO/AI discovery، PWA، SRE/observability و قابلیت‌های عملیاتی واقعی.

**اصل مهم:** Enterprise بودن هرگز به معنی ساده‌کردن ظاهر نیست. هویت بصری Premium باید هم‌زمان با امنیت، سرعت، دسترس‌پذیری و قابلیت‌های هوشمند ارتقا پیدا کند.

## 2) قانون اجرای اجباری

چرخه هر تغییر:

`AUDIT → OWNERSHIP → GAP → IMPLEMENT → TEST → FIX → RETEST → EVIDENCE → TRUTH LOCK → NEXT GAP`

ممنوع:
- ساخت از نو بدون ضرورت و اجازه صریح مالک
- نسخه موازی / Repo موازی / سایت موازی
- حذف قابلیت سالم برای راحتی توسعه
- mock/demo/fake-success در جای قابلیت عملیاتی
- ادعای PASS بدون تست و Evidence
- ادعای Production 10/10 بدون شواهد واقعی
- داده پزشکی، آدرس، ساعت، قیمت، مختصات، مدارک، بیمه، تجهیزات، Review، Rating یا Social ساختگی
- ذخیره Secret در Front-end
- تغییر پنهان یا بدون ثبت

اگر Evidence کافی نیست: `STOP_BLOCKER` و ثبت دقیق علت.

## 3) خط اصلی پروژه

- Repository: `galaxy1364/SiteMinadental`
- Branch اجرایی: `main`
- دامنه هدف Production: `https://minadentalclinic.ir/`
- Preview بصری/UX فعلی: `https://galaxy1364.github.io/SiteMinadental/preview-r2/`
- Enterprise Audit Center: `#/audit`
- Visual QA Map: `#/qa`

**Truth:** Root فعلی مخزن هنوز Runtime قدیمی `2026.08.05.1` است و تا وقتی Runtime جدید، Domain، Backend و Production verification کامل نشود نباید با عنوان Enterprise Production نهایی معرفی شود.

## 4) Design / UX Lock

باید حفظ و تقویت شود:
- Premium / cinematic clinical visual direction
- تصاویر واقعی خود پروژه، نه stock/competitor template
- RTL فارسی واقعی و Mobile-first
- Hero تصویری حرفه‌ای، depth، glass/gradient کنترل‌شده
- Bento / storytelling / scrollytelling
- Native-app-like mobile dock
- Distinct visual treatment برای هر Service
- Micro-interactions با `prefers-reduced-motion`
- Loading / empty / error / success / blocked states
- Truthful backend-gated states
- QA inspector برای تشخیص ایراد صفحه، route و viewport

## 5) Capability Target

### Patient Experience
- Services hub + صفحات مستقل درمان
- Smart Persian search
- Patient Journey
- Treatment Comparison
- Cost Estimate بدون قیمت ساختگی
- Online Consultation
- Dental Emergency education
- My Mina patient portal
- Family profiles
- Intake
- Treatment-plan accept/decline + e-sign evidence
- Aftercare
- Finance / ledger / installments
- Documents
- Clinical published view
- Virtual visit readiness
- Recall engine
- Smart waitlist
- Review/NPS/CSAT flow
- Referral flow

### AI
- AI Concierge فقط برای navigation/education
- RAG فقط از محتوای تأییدشده
- citation / provenance / confidence / human handoff
- ممنوعیت تشخیص قطعی، تجویز و دوز دارو
- prompt-abuse/red-team suite قبل از Production AI

### Iran-local
- شماره موبایل ایران و normalization +98
- Jalali UI با backend timestamp استاندارد
- Neshan/Balad adapter بعد از تأیید Map Pin
- SMS/OTP provider واقعی
- PSP/payment provider واقعی
- تست شبکه ضعیف 3G/4G ایران

## 6) Global Standards Baseline

معیارهای فعلی پروژه:
- WCAG 2.2 AA + تست انسانی VoiceOver/TalkBack/Keyboard/Zoom/Focus/Target Size
- Core Web Vitals field p75: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1
- OWASP Top 10 + OWASP ASVS 5.0.0
- NIST CSF 2.0
- NIST AI RMF + GenAI Profile برای AI governance
- ISO/IEC 42001 mapping برای AI governance در صورت ورود AI Production
- CodeQL SAST
- DAST/ZAP baseline
- Secret leak guard
- Dependency/Supply-chain controls
- SBOM CycloneDX/SPDX target
- Google Search Essentials / people-first content / structured-data truthfulness
- Medical content editorial workflow: Author → Medical Review → Approve → Publish → Review Date → Revision History
- OpenTelemetry target برای traces/metrics/logs
- Backup/Restore drill + RPO/RTO
- Independent pentest قبل از Production 10/10

هیچ استاندارد یا گواهی نباید فقط به شکل Badge ادعا شود؛ applicability و evidence لازم است.

## 7) CI / Audit Truth

موجود/فعال در Repository:
- Enterprise Security & Production Gate
- CodeQL JavaScript/TypeScript analysis
- Dependabot GitHub Actions updates
- SECURITY policy
- CODEOWNERS
- Global Enterprise Audit workflow

Global Audit target:
- JS syntax
- HTML validation
- asset/truth contract
- real Chromium route smoke tests
- mobile horizontal-overflow test
- Lighthouse evidence
- automated WCAG/Pa11y evidence
- OWASP ZAP baseline evidence

**قانون:** Failure باید اصلاح شود؛ خاموش‌کردن Validator برای گرفتن چراغ سبز ممنوع است مگر rule واقعاً نامربوط باشد و دلیل ثبت شود.

## 8) Truth-gated Owner/Provider Inputs

تا دریافت/تأیید واقعی، نمایش قطعی ممنوع:
- آدرس پستی دقیق
- ساعت کاری
- Map Pin / latitude / longitude
- شماره‌های عمومی نهایی
- مدارک/عنوان/رزومه دقیق پزشک
- تجهیزات و تکنولوژی‌ها
- بیمه‌ها
- گارانتی/financing
- قیمت یا Range خدمات
- Before/After بدون consent
- Reviews/Ratings/Awards
- Social handles

## 9) Production Infrastructure Gates

برای Production واقعی هنوز باید شواهد اجرایی کامل شوند:
- Cloudflare project/domain/Worker/headers/WAF/Turnstile/rate limiting
- Supabase Production schema + RLS + auth
- OTP / recovery / abuse controls
- Admin MFA/AAL2/Passkeys
- Payment callbacks/idempotency/reconciliation/refund
- OpenTelemetry/RUM/alerts/SLO
- backup/restore drill
- Search Console / sitemap / URL inspection
- field Core Web Vitals
- manual accessibility device testing
- independent pentest

## 10) Current Preview / R3

Preview R3 برای Visual/UX Acceptance است و `noindex,nofollow` باقی می‌ماند. در آن:
- Home cinematic redesign
- service storytelling
- Experience hub
- My Mina acceptance UI
- search / comparison / cost / consultation validation
- AI safety demo
- Privacy/Status/Accessibility/Guides/QA
- Enterprise Audit Center
- truthful backend blocked states

Preview هرگز نباید به‌عنوان Production data/system معرفی شود.

## 11) Lovable Status

Lovable Workspace/Project متصل است، اما آخرین بررسی نشان داد workspace credit ندارد و Build واقعی پروژه MinaVision تکمیل نشده است. Lovable تا بازگشت Credit یک ابزار Blocked است؛ خروجی ناقص/blank آن نباید جای Source اصلی سایت را بگیرد. پس از فعال‌شدن Credit، همان Project موجود باید ادامه یابد؛ پروژه Lovable جدید موازی ممنوع است.

## 12) Persistence / Change Contract

از این لحظه:
1. همین `README.md` سند مادر و حافظه اجرایی پروژه است.
2. هر تغییر مهم باید وضعیت Done/Gap/Blocked را همین‌جا به‌روزرسانی کند.
3. کد سالم حذف نمی‌شود مگر با Evidence که جایگزین بهتر و سازگار وجود دارد.
4. هر Deploy باید version/commit/evidence قابل ردیابی داشته باشد.
5. Root Production فقط پس از Gateهای لازم ارتقا می‌یابد؛ Preview محل Acceptance قبل از Rollout است.
6. Rollback path باید قبل از هر تغییر پرریسک مشخص باشد.
7. هیچ Success عملیاتی بدون backend/server evidence نمایش داده نمی‌شود.

## 13) Immediate Priority Queue

1. 🟡 Truth-hardening Root metadata/schema و حذف داده‌های تأییدنشده — مرحله اول انجام شد؛ sweep کامل Bundle/Content ادامه دارد
2. 🟡 تکمیل Global Enterprise Audit تا Browser/Lighthouse/WCAG/ZAP evidence
3. ⬜ یکپارچه‌کردن R3 Visual DNA با Runtime Enterprise بدون regression
4. ⬜ حذف staging remnants فقط بعد از تأیید عدم نیاز و با audit
5. ⬜ Production domain/Cloudflare verification
6. ⬜ Supabase/Auth/RLS/OTP/Turnstile
7. ⬜ Booking/Recall/Waitlist/Payments واقعی
8. ⬜ Owner truth-data ingestion
9. ⬜ Device accessibility + field performance + pentest
10. ⬜ Production 10/10 فقط پس از Evidence کامل

## 14) Current Hardening Log — 2026-09-03

### DONE
- `README.md` از فایل خالی/حداقلی به سند مادر واحد Governance/Truth Lock ارتقا یافت.
- Root `index.html` بدون تغییر Visual Bundle، Truth-Harden شد: آدرس دقیق، ساعت، مختصات، تلفن، ایمیل، Social handles، price/payment fields و ادعاهای غیرقابل‌اثبات از JSON-LD/metadata حذف شدند.
- `manifest.webmanifest` از مسیر hard-coded `/SiteMinadental/` به مسیرهای relative تبدیل شد تا GitHub Pages و دامنه نهایی از یک Manifest استفاده کنند.
- shortcut عملیاتی «رزرو نوبت» از Manifest قدیمی حذف شد تا بدون Backend موفقیت/قابلیت ضمنی ادعا نشود.
- `pwa-runtime.js` از Base hard-coded خارج شد و Service Worker scope از محل واقعی Script مشتق می‌شود.
- ذخیره ضمنی تمام فرم‌ها در `sessionStorage` حذف شد؛ فقط fieldهایی که صریحاً `data-pwa-preserve="true"` دارند قابل نگهداری‌اند.
- Install Prompt خودکار روی اولین click/keypress حذف و به API/Event کنترل‌شده `window.MinaPWA` تبدیل شد.
- `sw.js` Base پویا گرفت و `api/`, `portal/`, `admin/`, `admin.html`, `version.json`, `sw.js` از cache/fallback حساس خارج شدند.

### EVIDENCE / COMMITS
- Master Governance: `67fd5f85fdb2337ec6c76fad959b6273e246ef1d`
- Root truth metadata: `0c4b89cec39d96d27118842a090706763a5598dc`
- Portable truth-safe manifest: `889c37f69df3611455410a0c44d91b08f22bf7ec`
- PWA runtime privacy/base hardening: `88745f61dbdf37ce4eef1d9897f4af45628350df`
- Service Worker cache hardening: `5b523bb7bdad4f8177b796925f01f9dfad64a827`

### NOT YET CLAIMED
- V9/Enterprise runtime is **not** claimed live on Production.
- `minadentalclinic.ir` is **not** claimed verified until direct domain/Cloudflare evidence exists.
- Booking/OTP/Payment/Portal backend are **not** claimed operational.
- WCAG human/device PASS, field CWV PASS and pentest PASS are **not** claimed.

---

**Project Truth:** طراحی عالی + قابلیت واقعی + امنیت + شفافیت + Evidence = Enterprise. هیچ‌کدام به‌تنهایی کافی نیست.