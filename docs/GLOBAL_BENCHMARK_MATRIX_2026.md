# GLOBAL BENCHMARK MATRIX 2026

## قانون مبنا

- Visual Source of Truth همان Kimi است.
- Hero، ترتیب سکشن‌ها، کارت‌ها، پالت سبز/طلایی، RTL و انیمیشن‌ها بدون تأیید مالک تغییر ماهوی نمی‌کنند.
- هیچ Review، مدرک، عکس بیمار، رتبه، قیمت، بیمه یا نتیجه درمان ساختگی مجاز نیست.

## ماتریس قابلیت‌ها

| حوزه | الگوی پیشرفته | وضعیت Mina Site |
|---|---|---|
| رزرو | انتخاب خدمت/زمان، تأیید و یادآوری | مدل لید، زمان ترجیحی، شناسه، واتساپ و API adapter پیاده‌سازی شده؛ تقویم واقعی نیازمند backend |
| ارتباط | تماس، واتساپ، پیامک و پیام‌رسان‌ها | تماس/واتساپ فعال؛ Telegram/Bale/Rubika/CRM adapter آماده؛ سایر کانال‌ها نیازمند URL/API رسمی |
| پذیرش پیش از مراجعه | هدف، اضطراب، ترجیحات آرامش و محدودیت زمانی | Decision Center و comfort preferences غیرحساس پیاده‌سازی شده |
| هوش مصنوعی | پاسخ‌گویی، FAQ، رزرو و handoff | AI adapter سروری + fallback محلی + voice + guardrail پیاده‌سازی شده |
| جست‌وجو | خدمت، پزشک، راهنما و لوکیشن | جست‌وجوی سراسری فارسی و Ctrl/⌘+K پیاده‌سازی شده |
| محتوا | صفحات خدمت، FAQ، مقاله و لینک داخلی | registry صفحات، prerender و صفحات خدمت/لوکال/پزشک/راهنما پیاده‌سازی شده |
| گالری | قبل/بعد با رضایت | Evidence gate آماده؛ انتشار تا دریافت رضایت و فایل واقعی بسته است |
| اعتماد | پروفایل، مدارک، تیم، تصاویر و Review منبع‌دار | شماره نظام پزشکی فعال؛ سایر شواهد Owner Gate دارند |
| پرداخت/اقساط | پرداخت آنلاین و برنامه مالی | اتصال واقعی نیازمند درگاه و سیاست مالی مالک |
| بیمه | قراردادها و مدارک قابل ارائه | ادعای قرارداد حذف شده؛ فقط پس از سند رسمی فعال می‌شود |
| لوکال SEO | NAP، Maps، GBP، صفحات محلی و Schema | آدرس/تلفن/نام سابق/Maps ثبت؛ geo و GBP تا تأیید قفل است |
| تبلیغات | UTM، click IDs و conversion events | attribution، gclid/fbclid، dataLayer و event contract پیاده‌سازی شده |
| PWA | نصب، standalone، offline و update | manifest، icons، SW، install/update UI و Safe Area پیاده‌سازی شده |
| امنیت | CSP، rate limit، origin validation و consent | baseline پیاده‌سازی شده؛ تست Production باقی است |
| دسترس‌پذیری | keyboard، focus، reduced motion و RTL | baseline پیاده‌سازی شده؛ WCAG browser audit باقی است |

## گیت انتشار

تا زمانی که Build، CI، Preview React، Mobile/PWA، Lighthouse، Rich Results، Security و Owner Review پاس نشوند، Production، index و Ads ممنوع است.
