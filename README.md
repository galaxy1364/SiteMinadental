# SiteMinadental

وب‌سایت رسمی «دندانپزشکی دکتر مینا مازندرانی» بر پایه همان سورس اصلی Kimi و با ارتقای درجا.

## Visual Source of Truth

- مبنا: `Kimi_Agent_牙科网站全程.zip`
- SHA256 مرجع: `6f2de8b51414fcec4c4062654538e950910b9a580f28ebea89d7368c405b43da`
- Hero، ترتیب سکشن‌ها، کارت‌ها، پالت سبز/طلایی، انیمیشن‌ها و حس بصری Kimi قفل هستند.
- بازطراحی از صفر، ساده‌سازی، نسخه موازی، داده ساختگی و دکمه مرده ممنوع است.

## Current Status

`IMPLEMENTED_NOT_VERIFIED`

ارتقای درجا در working copy انجام شده است:

- اصلاح اطلاعات برند، تلفن، آدرس، نام قدیمی صدف و شماره نظام پزشکی
- حذف ارتودنسی و ادعاهای غیرقابل‌اثبات
- فرم واقعی محلی + انتقال واتساپ
- PWA، نصب Home Screen، حالت آفلاین و چرخه بروزرسانی
- دستیار گفتگویی/صوتی غیرتشخیصی
- Safe Area، focus، reduced motion و دسترس‌پذیری پایه
- Schema امن بدون مختصات، دامنه، Review یا مدرک ساختگی

## Verification Evidence

- ترتیب تمام سکشن‌های اصلی Kimi حفظ شده است.
- ۷۶ فایل TypeScript/TSX از نظر transpile/syntax پاس شده‌اند.
- `manifest.webmanifest` و `sw.js` از نظر syntax پاس شده‌اند.
- Build نهایی هنوز پاس نشده است؛ رجیستری داخلی محیط اجرای فعلی تعدادی tarball قفل‌شده را با 404/EAI_AGAIN برمی‌گرداند.

## STOP_BLOCKER

تا قبل از build تمیز، تست موبایل و تأیید مالک، merge به `main`، انتشار Production، index شدن و تبلیغات ممنوع است.

## Resume Point

`KIMI_VISUAL_LOCKED → CLEAN_BUILD → MOBILE/PWA_TEST → PUSH_FULL_SOURCE → PREVIEW_DEPLOY → OWNER_REVIEW`
