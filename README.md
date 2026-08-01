# SiteMinadental

وب‌سایت رسمی «دندانپزشکی دکتر مینا مازندرانی» بر پایه همان سورس اصلی Kimi و با ارتقای درجا.

## Visual Source of Truth

- مبنا: `Kimi_Agent_牙科网站全程.zip`
- SHA256 مرجع: `6f2de8b51414fcec4c4062654538e950910b9a580f28ebea89d7368c405b43da`
- Hero، ترتیب سکشن‌ها، کارت‌ها، پالت سبز/طلایی، انیمیشن‌ها و حس بصری Kimi قفل هستند.
- بازطراحی از صفر، ساده‌سازی، نسخه موازی، داده ساختگی و دکمه مرده ممنوع است.

## Current Status

`IMPLEMENTED_NOT_VERIFIED`

ارتقای درجا در Working Copy انجام شده است:

- اصلاح اطلاعات برند، تلفن، آدرس، نام قدیمی صدف و شماره نظام پزشکی
- حذف ارتودنسی و ادعاهای غیرقابل‌اثبات
- قرارداد مرکزی لید + ذخیره محلی و انتقال صادقانه واتساپ
- UTM و attribution، رویدادهای تبلیغاتی و رضایت آمار
- PWA، نصب Home Screen، آفلاین و چرخه بروزرسانی
- دستیار گفتگویی/صوتی غیرتشخیصی با AI سروری اختیاری و fallback تأییدشده
- آداپترهای سروری Telegram، Bale، Rubika و CRM؛ همگی خاموش تا دریافت credential
- لینک‌های Instagram، Telegram، Bale، Eitaa و Rubika فقط پس از تأیید URL رسمی نمایش داده می‌شوند
- صفحات خدمات، پزشک، لوکیشن، راهنمای فوری و قوانین با prerender کامل
- Schema و sitemap مشروط به دامنه و مجوز ایندکس
- Safe Area، focus، reduced motion، CSP، origin validation و rate limit پایه
- تمام URLهای mirror در package-lock به `registry.npmjs.org` نرمال شده‌اند

## Verification Evidence

- ترتیب تمام سکشن‌های اصلی Kimi حفظ شده است.
- ۱۴۹ فایل پروژه و ۱۱۰ فایل سورس ممیزی شدند؛ finding فعلی صفر است.
- ۸۴ فایل TypeScript/TSX از نظر transpile/syntax پاس شدند.
- تمام JavaScriptهای API/build/service-worker از نظر syntax پاس شدند.
- `package.json`، `package-lock.json`، `manifest.webmanifest` و `vercel.json` معتبرند.
- ارجاع خراب Open Graph از `hero-bg.jpg` به دارایی واقعی `hero-bg.webp` اصلاح شد.
- Build نهایی هنوز در این محیط پاس نشده است؛ DNS عمومی npm در کانتینر در دسترس نیست و باید GitHub CI آن را اثبات کند.

## STOP_BLOCKER

تا قبل از push کامل سورس، CI تمیز، Preview، تست موبایل/PWA، دامنه و اطلاعات بیزنس تأییدشده و تأیید مالک، merge به `main`، انتشار Production، index شدن و تبلیغات ممنوع است.

## Resume Point

`KIMI_INPLACE_INTELLIGENCE_LAYER_COMPLETE → PUSH_FULL_SOURCE_TO_BRANCH → GITHUB_CI → PREVIEW_DEPLOY → MOBILE/PWA/SEO_AUDIT → OWNER_REVIEW`
