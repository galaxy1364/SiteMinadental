# SiteMinadental — Kimi Smart Growth V4

وب‌سایت رسمی «دندانپزشکی دکتر مینا مازندرانی» بر پایه همان سورس اصلی Kimi و با ارتقای درجا.

## Visual Source of Truth
- مبنا: `Kimi_Agent_牙科网站全程.zip`
- SHA256: `6f2de8b51414fcec4c4062654538e950910b9a580f28ebea89d7368c405b43da`
- Hero، ترتیب سکشن‌ها، کارت‌ها، پالت سبز/طلایی، RTL و انیمیشن‌های Kimi قفل هستند.
- بازطراحی از صفر، نسخه موازی، داده ساختگی و دکمه مرده ممنوع است.

## Live Private Preview
- Web/PWA: `https://siteminadental-kimi-smart-live.vercel.app`
- Deployment: `dpl_61UXF2ECJoJiqVLmAj1rCnYJSfAM`
- State: `READY`
- Robots: `noindex,nofollow`

## V4 Implemented in Working Copy
- قرارداد نسخه‌دار MinaDent برای availability، hold، confirm، waitlist و manage
- Proxy سروری بدون افشای token و fallback به Request/WhatsApp
- Online Booking، Patient Center، Virtual Consult و Install PWA page
- پنج Campaign Landing برای ایمپلنت، زیبایی، ریشه، کودک و مراجعه فوری
- UTM، gclid، fbclid، consent و dataLayer
- Meta CAPI adapter و Marketing Webhook برای Google Data Manager/CRM
- endpoint امن بازگشت conversion stage از MinaDent
- جست‌وجو، تصمیم‌یار و دستیار AI/voice با گاردریل پزشکی
- PWA، offline، update، Safe Area و Home Screen
- prerender، Schema و Sitemap مشروط به دامنه و مجوز ایندکس

## Verification Evidence
- ۱۸۰ فایل ممیزی شدند.
- ۹۷ فایل TypeScript/TSX: transpile syntax PASS.
- JavaScript/API/Service Worker: syntax PASS.
- ۲۳۷ import داخلی، unresolved: صفر.
- missing و unused asset: صفر.
- forbidden finding و fake-success: صفر.
- ۷ فرم، ۳۷ دکمه، ۴۳ لینک و ۶ submit handler ممیزی شدند.
- Build کامل React در این کانتینر اثبات نشده؛ node_modules ناقص و registry داخلی npm یک tarball را 404 می‌کند. GitHub CI عمومی باید build را اثبات کند.

## STOP_BLOCKER
تا قبل از push کامل سورس، CI تمیز، React Preview، Visual Regression، تست iPhone/Android، Lighthouse، Security، دامنه و credentialهای واقعی، Production، public indexing و Ads ممنوع است.

## Resume Point
`KIMI_SMART_GROWTH_V4_CODE_COMPLETE → PUSH_FULL_SOURCE → GITHUB_CI → REACT_PREVIEW → DEVICE/LIGHTHOUSE/SEO/SECURITY → OWNER_CONNECTION_GATE → PRODUCTION`
