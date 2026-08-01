# SiteMinadental — Kimi Premium Intelligence V5

وب‌سایت رسمی «دندانپزشکی دکتر مینا مازندرانی» بر پایه همان سورس اصلی Kimi و با ارتقای درجا.

## Visual Source of Truth
- مبنا: `Kimi_Agent_牙科网站全程.zip`
- SHA256: `6f2de8b51414fcec4c4062654538e950910b9a580f28ebea89d7368c405b43da`
- Hero، ترتیب اصلی سکشن‌ها، کارت‌ها، RTL، انیمیشن‌ها و حس Kimi قفل هستند.
- پالت V5: کله‌غازی `#0B5D59`، عمیق `#063F3C`، تعاملی `#0E736B` و طلایی محدود `#D5A64D`.
- بازطراحی از صفر، نسخه ساده موازی، داده ساختگی و دکمه مرده ممنوع است.

## Live Private Preview
- Web/PWA: `https://siteminadental-kimi-premium-v5.vercel.app`
- Deployment: `dpl_AbWGViZXHwedvw5X969GjFTqFPiw`
- Version: `kimi-premium-v5-r3`
- Preview commit: `74e8d1d1c688c5b0215c6504775c2dc9ff6147cf`
- State: `READY`
- Robots: `noindex,nofollow`

## V5 Implemented in Working Copy
- Hero تصویری پریمیوم، Clinic Experience، Treatment Explorer و Technology Showcase
- سرویس‌های تصویری، Patient Journey، Social Content Hub و Evidence Gate
- جست‌وجوی سراسری، تصمیم‌یار غیرتشخیصی و دستیار فارسی/صوتی
- قرارداد نسخه‌دار MinaDent برای availability، hold، confirm، waitlist، cancel و reschedule
- Online Booking با fallback صادقانه به Request/WhatsApp
- Patient Center، Virtual Consult و ساختار پرتال آینده
- UTM، gclid، fbclid، consent، dataLayer، Meta CAPI و server-side conversion
- پنج Campaign Landing و مسیر بازگشت conversion stage از MinaDent
- PWA، Home Screen، offline، update، Safe Area و آیکون‌های PNG 192/512
- prerender، Schema و Sitemap مشروط به دامنه و مجوز ایندکس

## Verification Evidence
- ۱۸۹ فایل و ۱۲۶ فایل سورس ممیزی شدند.
- ۱۰۳ فایل TypeScript/TSX: transpile syntax PASS.
- JavaScript/API/Service Worker: syntax PASS.
- ۲۴۵ import داخلی؛ unresolved: صفر.
- missing asset: صفر؛ forbidden finding و fake-success: صفر.
- ۷ فرم، ۳۹ دکمه، ۴۳ لینک و ۶ submit handler ممیزی شدند.
- Root، Manifest، Service Worker، version.json و آیکون‌های 192/512 روی HTTPS پاسخ 200 دارند.
- تمام URLهای تصاویر نمونه Preview پاسخ 200 دارند و صریحاً به‌عنوان نمونه برچسب خورده‌اند.
- Build کامل React در این کانتینر اثبات نشده؛ node_modules ناقص است و CI عمومی باید `npm ci`، `tsc -b` و Vite build را اثبات کند.

## STOP_BLOCKER
تا قبل از push کامل سورس، CI تمیز، React Preview مستقیم، Visual Regression، تست iPhone/Android، Lighthouse/WCAG/Security، تصاویر واقعی، دامنه و credentialهای مالک، ایندکس عمومی و Ads ممنوع است.

## Resume Point
`KIMI_PREMIUM_V5_LIVE → OWNER_MOBILE_REVIEW → PUSH_FULL_REACT_SOURCE → PUBLIC_REGISTRY_CI → VISUAL_REGRESSION/LIGHTHOUSE/WCAG/SECURITY → OWNER_MEDIA_AND_CREDENTIAL_GATE → OFFICIAL_DOMAIN/INDEXING/ADS`
