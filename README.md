# SiteMinadental

وب‌سایت رسمی «دندانپزشکی دکتر مینا مازندرانی» بر پایه همان سورس اصلی Kimi و با ارتقای درجا.

## Visual Source of Truth

- مبنا: `Kimi_Agent_牙科网站全程.zip`
- SHA256 مرجع: `6f2de8b51414fcec4c4062654538e950910b9a580f28ebea89d7368c405b43da`
- Hero، ترتیب سکشن‌ها، کارت‌ها، پالت سبز/طلایی، انیمیشن‌ها و حس بصری Kimi قفل هستند.
- بازطراحی از صفر، ساده‌سازی، نسخه موازی، داده ساختگی و دکمه مرده ممنوع است.

## Live Private Preview

- URL: `https://siteminadental-kimi-smart-live.vercel.app`
- Deployment: `dpl_61UXF2ECJoJiqVLmAj1rCnYJSfAM`
- State: `READY`
- Robots: `noindex,nofollow`
- این Preview برای بررسی موبایل، UX، PWA و قابلیت‌های هوشمند است و Production عمومی نیست.

## Current Status

`IMPLEMENTED_NOT_VERIFIED`

ارتقای درجا در Working Copy انجام شده است:

- اصلاح اطلاعات برند، تلفن، آدرس، نام قدیمی صدف و شماره نظام پزشکی
- حذف ارتودنسی و ادعاهای غیرقابل‌اثبات
- قرارداد مرکزی لید + ذخیره محلی و انتقال صادقانه واتساپ
- UTM و attribution، رویدادهای تبلیغاتی و رضایت آمار
- PWA، نصب Home Screen، آفلاین و چرخه بروزرسانی
- دستیار گفتگویی/صوتی غیرتشخیصی با AI سروری اختیاری و fallback تأییدشده
- جست‌وجوی سراسری فارسی و میانبر `Ctrl/⌘+K`
- مرکز تصمیم‌گیری بیمار برای درد، دندان ازدست‌رفته، زیبایی، کودک و معاینه
- مشاهده درخواست‌های ثبت‌شده روی همان دستگاه، بدون ادعای پرتال پزشکی
- آداپترهای سروری Telegram، Bale، Rubika و CRM؛ خاموش تا دریافت credential
- لینک‌های Instagram، Telegram، Bale، Eitaa و Rubika فقط پس از تأیید URL رسمی نمایش داده می‌شوند
- صفحات خدمات، پزشک، لوکیشن، راهنمای فوری و قوانین با prerender
- Schema و sitemap مشروط به دامنه و مجوز ایندکس
- Safe Area، focus، reduced motion، CSP، origin validation و rate limit پایه

## Verification Evidence

- ترتیب و نظام بصری Kimi قفل و حفظ شده است.
- ممیزی ماشینی پروژه: ۱۵۴ فایل، ۱۶۲ import داخلی، صفر import حل‌نشده و صفر asset گمشده.
- ۸۷ فایل TypeScript/TSX از نظر transpile/syntax پاس شدند.
- تمام JavaScriptهای API/build/service-worker از نظر syntax پاس شدند.
- Manifest، Service Worker، HTML و JavaScript Preview روی HTTPS پاسخ `200 OK` دارند.
- Vercel Deployment در وضعیت `READY` است.
- تست runtime محلی Preview پاس شد: ساخت خدمات، تصمیم‌یار، بازشدن جست‌وجو، دستیار، ذخیره لید و ساخت URL واتساپ.
- `package.json`، `package-lock.json`، `manifest.webmanifest` و `vercel.json` معتبرند.
- ارجاع Open Graph به دارایی واقعی WebP اصلاح شده است.
- Build کامل React هنوز در این کانتینر پاس نشده؛ رجیستری داخلی npm یک tarball قفل‌شده را 404 برمی‌گرداند و CI عمومی باید آن را اثبات کند.

## STOP_BLOCKER

تا قبل از انتقال کامل سورس به این شاخه، CI تمیز، Visual Regression روی Kimi، تست واقعی iPhone/Android، دامنه و اطلاعات بیزنس تأییدشده و تأیید مالک، merge به `main`، انتشار Production، index شدن و تبلیغات ممنوع است.

## Resume Point

`KIMI_SMART_PREVIEW_READY → OWNER_MOBILE_REVIEW → PUSH_FULL_REACT_SOURCE → GITHUB_CI → VISUAL/PWA/LIGHTHOUSE/SEO_AUDIT → OWNER_CREDENTIAL_GATE → MAIN_MERGE`
