# وضعیت جایگزینی با سورس Work — ۲۰۲۶-۰۹-۰۸

مالک پس از گزارش تفاوت دو ساختار، صریحاً دستور «انتقال بده جایگزین کن دسترسی و ادیت داشته باشد» داد. این دستور مجوز آماده‌سازی جایگزینی سورس در ریشه همین مخزن است؛ محدودیت‌های سابق انتخاب runtime در این تغییر با انتخاب همان پروژه Work جایگزین می‌شوند. ممنوعیت جعل داده، اختلاط با برنامه مدیریت، دورزدن آزمون و انتشار بدون گیت موبایل برقرار است.

- مبدا قطعی: appgprj_6a73260c5d508191928f0f76466e48f0، /workspace/sites/dr-mina-mazandarani
- Source revision: 889d11ee2b552ccfcb7a882c66da828f874c37af؛ کد محصول همان 2ce32ea23ed38a611fc4478eacd3c5ff4ff4f029 است.
- نقطه بازگشت / parent: dae6d73adbd4ad70dc34308de2716d4ba64022c8
- جایگزینی پیشنهادی: ۴۳ فایل غیر README مبدا در ریشه با همان blob hash و mode؛ سابقه README مبدا و سند مادر قبلی هر دو در همین فایل حفظ می‌شوند. پوشه snapshot تکراری و runtime قبلی از درخت پیشنهادی خارج می‌شوند؛ تمام آن‌ها در parent و تاریخچه Git محفوظ‌اند.
- فایل‌های forensic در .payload، .v9* و exact-payload و تمام .github بدون تغییر حفظ می‌شوند.
- دسترسی: Sites current_user_role=owner؛ دسترسی GitHub در بررسی قبلی push/admin=true بود. هیچ دسترسی عمومی ویرایش یا credential در سورس اضافه نمی‌شود.
- آزمون همین مرحله: شش آزمون قرارداد سورس PASS؛ تطبیق ۴۳ blob غیر README با snapshot GitHub PASS. ساخت/نصب تازه، آزمون مرورگر، رندر موبایل و انتشار انجام نشده‌اند.
- STOP_BLOCKER برای ادغام/انتشار ریشه: enterprise-security-ci فایل‌های config.js، assets/js/site.js، sw.js و _worker.js ریشه قدیم را الزام می‌کند؛ supply-chain-integrity فایل index.html و config.js قدیم را الزام می‌کند؛ global-enterprise-audit صفحات static روی GitHub Pages را می‌آزماید؛ cloudflare-production برای خروجی static قدیم نوشته شده است. سورس Work یک برنامه Vinext/Worker است و این گیت‌ها اعتبارسنجی آن نیستند. این workflowها برای سبزکردن نتیجه خاموش یا حذف نشده‌اند.
- همگام‌سازی: وظیفه ساعتی موجود فقط Sites → sites/dr-mina-mazandarani در main است. تا تعیین و آزمون انتقال دوطرفه، این PR نباید ادغام شود تا مسیر قدیمی دوباره ساخته نشود. اتصال دوطرفه خودکار NOT_IMPLEMENTED؛ هر ویرایش مستقل در GitHub باید پیش از انتقال بعدی از نظر تعارض بررسی شود.
- قدم بعدی: تطبیق گیت‌های CI و انتشار با همان runtime، تعیین قرارداد انتقال دوطرفه و آزمون رفت‌وبرگشت و تعارض؛ سپس ادغام مجاز بدون force. مجوز مالک موجود است و درخواست مجدد مجوز جایگزینی لازم نیست.
- Resume: RP-SITEMINADENTAL-ROOT-REPLACEMENT-CI-SYNC-GATES-2026-09-08

## سابقه شواهد سایت Work

# وب‌سایت عمومی دندانپزشکی دکتر مینا مازندرانی

این مخزن فقط وب‌سایت عمومی و نصب‌شونده «مینا» را نگهداری می‌کند. برنامه مدیریت دندانپزشکی Base44 محصول، سورس، دیتابیس و چرخه انتشار جداگانه دارد و هیچ کدی از آن در این مخزن قرار نمی‌گیرد.

## مبنای جاری و نقطه ادامه — ۲۰۲۶-۰۹-۰۷

مالک پس از توضیح تفاوت سایت ۵ اوت با Kimi روز ۶ سپتامبر، همین سایت بازشده را صریحاً مبنای ادامه تأیید کرد. شناسه canonical: `appgprj_6a73260c5d508191928f0f76466e48f0`؛ مسیر `/workspace/sites/dr-mina-mazandarani`؛ baseline `558320bf440fd576b5c31534fc3a6cbe2a4ae49e`. این تصمیم جایگزین محدودیت انتخاب فقط Artifact روز ۶ سپتامبر است؛ فایل‌های Kimi مرجع مستقل‌اند.

مرحله جاری: تغییر رنگ همان ساختار به یاسی، فیروزه‌ای و آبی روشن، حرکت آرام opacity زمینه، حفظ reduced-motion، بدون تغییر route، نسخه dependency، داده، schema یا اتصال برنامه مدیریت. وضعیت: BUILD_PASS / DESKTOP_QA_PASS / PUBLISHED.

پس از اجازه مرحله‌ای مالک، نصب قفل‌شده با npm ci موفق شد (۵۰۷ بسته). SHA-256 فایل‌های package.json و package-lock.json پیش و پس از نصب برابر است. ساخت رسمی پنج‌مرحله‌ای و اعتبارسنجی ESM Worker/default.fetch موفق؛ هفت آزمون موجود (شش قرارداد و یک رندر Worker) موفق.

شواهد مرورگر پیش‌نمایش در ۲۰۲۶-۰۹-۰۷: viewport برابر ۱۳۶۳×۹۳۶؛ بررسی تصویری صفحه و کارت‌های سه‌رنگ؛ بدون تصویر خراب و سرریز افقی؛ global-aurora فعال با opacity مشاهده‌شده 0.613723 و 0.747157 در دو زمان؛ راهنما باز/بسته شد؛ FAQ باز شد؛ پنجره نصب باز و با Escape بسته شد و فوکوس به دکمه نصب برگشت. در ۲۰ خطای اخیر دریافت‌شده، خطای غیرمرتبط با افزونه مرورگر یافت نشد. این بررسی، تست کامل همه قابلیت‌ها یا اندازه‌گیری عملکرد میدانی نیست.

تست موبایل، نصب واقعی روی گوشی، reduced-motion در دستگاه و اتصال backend هنوز NOT_VERIFIED هستند. قواعد reduced-motion در CSS موجودند. شماره نسخه نمایشی PWA همان مقدار موجود است؛ چرخه sync و cache در این مرحله تغییر نکرده است.

شاهد انتشار: Sites version 4؛ revision منتشرشده `5f2d48ad1d93bd1329dd4b0cbe32afc50fdd97f8`؛ deployment `appgdep_6a9eb98c29808191a95a5e1da0e8de6d` با وضعیت succeeded در `2026-09-07T13:18:19.487550+00:00`؛ همان URL عمومی `https://dr-mina-mazandarani.mostafahasanvand1985.chatgpt.site`. این ثبت وضعیت پس از انتشار فقط سند را تغییر می‌دهد.

رزرو، AI و تبلیغات واقعی هنوز به API و شواهد پذیرش مستقل نیاز دارند. ادعای تکمیل صددرصد، نصب روی گوشی و اتصال backend مجاز نیست. نقطه ادامه: `RP-MINA-COLOR-PUBLISHED-MOBILE-BACKEND-PENDING-2026-09-07`.

## ادامه ممیزی موبایل و اتصال — ۲۰۲۶-۰۹-۰۷

وضعیت: MOBILE_NOT_VERIFIED / BACKEND_STOP_BLOCKER. بررسی فقط روی همین مخزن انجام شد و هیچ مخزن مدیریتی خوانده یا تغییر داده نشد.

- در media query حداکثر ۵۸۰px، service-grid تک‌ستونی و dock پنج‌ستونی است؛ safe-area برای پایین صفحه، dock و راهنما لحاظ شده است. وجود این قواعد اثبات سلامت رندر گوشی نیست.
- اندازه متن mobile-dock small برابر 0.56rem است (حدود ۹px با ریشه ۱۶px). برای لینک‌های عادی dock حداقل ارتفاع صریح تعریف نشده؛ دکمه مرکزی ۵۴×۵۴px است. اندازه واقعی هدف لمس و خوانایی باید در viewport موبایل اندازه‌گیری شوند؛ برچسب قطعی انطباق/عدم انطباق داده نشد.
- API مرورگر مجاز در این جلسه قابلیت resize/device emulation ارائه نمی‌کند. یک فرمان بزرگ‌نمایی مرورگر اجرا شد اما viewport اندازه ۱۳۶۳×۹۳۶ و devicePixelRatio=1 باقی ماند؛ این کار آزمون موبایل محسوب نشد و تکرار یا ابزار جایگزین غیرمجاز اجرا نشد.
- در فایل‌های اختصاصی پروژه، OpenAPI/Swagger یا endpoint اجرایی رزرو یافت نشد. مسیر نمونه README صرفاً الزام آینده است؛ قرارداد سرویس واقعی نیست. ارسال نوبت، داده بیمار و تغییر schema انجام نشد.
- هیچ کد محصول، وابستگی، cache، route یا انتشار جدیدی در این ادامه تغییر نکرد. مرحله رنگ منتشرشده معتبر است؛ تکمیل همه امکانات همچنان تأیید نشده است.

نقطه ادامه فعلی: `RP-MINA-MOBILE-DEVICE-AND-BOOKING-CONTRACT-BLOCKED-2026-09-07`. برای گشودن گیت‌ها: آزمون روی گوشی/محیط شبیه‌سازی مجاز؛ و مستندات واقعی API نوبت‌دهی، آدرس محیط آزمایشی، روش احراز هویت بدون ارسال secret در چت، قرارداد درخواست/پاسخ و وضعیت‌های نوبت.

## اصلاح خوانایی و هدف لمس موبایل — در انتظار آزمون دستگاه

در ادامه درخواست ارتقای واقعی، برچسب نوار پایین از 0.56rem به 0.875rem، با line-height=1.4 تغییر کرد. لینک‌های عادی حداقل ابعاد 44×44 CSS px و چیدمان مرکزی گرفتند؛ رنگ متن از #66807e به #345e68 تغییر کرد. دکمه مرکزی، مسیر لینک‌ها، برند، ساختار و داده‌ها تغییر نکردند.

مرجع اندازه هدف لمس: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html ؛ حداقل AA برابر 24×24 با استثناهای تعریف‌شده است. مقدار 44px هدف اجرایی این اصلاح است، نه ادعای انطباق کامل سایت. 14px حد الزام‌شده WCAG نیست؛ تصمیم خوانایی برای برچسب‌های این پروژه است.

وضعیت این اصلاح: BUILD_PASS / 7_TESTS_PASS / MOBILE_NOT_VERIFIED / NOT_PUBLISHED. ساخت رسمی پنج‌مرحله‌ای و اعتبارسنجی artifact موفق؛ هفت آزمون موجود موفق و git diff --check بدون خطا. این تست‌ها رندر و تعامل موبایل را پوشش نمی‌دهند. آزمون رندر واقعی در عرض‌های ۳۲۰، ۳۹۰ و ۴۳۰، عدم هم‌پوشانی dock/راهنما، و بزرگ‌نمایی متن پیش از انتشار لازم است. مرورگر فعلی ابزار مجاز تنظیم viewport یا دستگاه ارائه نمی‌دهد؛ آزمون دسکتاپ جای این گیت را نمی‌گیرد. لینک عمومی همچنان انتشار رنگی قبلی است. نقطه ادامه: `RP-MINA-TOUCH-READABILITY-DEVICE-QA-REQUIRED`.

## ممیزی متن از دید مراجعه‌کننده — ۲۰۲۶-۰۹-۰۷

محدوده: متن Home، FAQ، راهنمای نصب، وضعیت به‌روزرسانی، پیام مکان‌یابی، footer و offline؛ صفحه 404 نیز خوانده شد و تغییر لازم نداشت. اطلاعات هویتی و پزشکی جدید، قیمت، ساعت کاری و ادعای خدمات تازه اضافه نشد.

اصلاح‌ها: حذف اشاره به مالک/API/فرم نمایشی از متن بیمار؛ توضیح صریح اینکه پیام واتساپ تأیید نوبت نیست؛ مشروط‌کردن افزودن سایت به سازگاری مرورگر؛ حذف ادعای همیشه‌تازه و نسخه‌به‌روز از متن ثابت؛ اصلاح رقم‌های ترکیبی ۰1/۰2/۰3 با همان آرایه ارقام فارسی؛ توضیح مقصد داده موقعیت هنگام بازکردن گوگل؛ جایگزینی پیام خطای گمراه‌کننده موقعیت با پیام عمومی دریافت‌نشدن؛ ساده‌سازی راهنما و متن آفلاین. مکانیزم cache، sync، API، route، schema و وابستگی‌ها تغییر نکرد.

اعتبارسنجی: ساخت رسمی پنج‌مرحله‌ای PASS؛ ۷ آزمون موجود PASS؛ ESLint PASS؛ diff check PASS. بررسی React روی تغییرات متن چند مؤلفه انجام شد. پیش‌نمایش مرورگر در ۱۳۶۳×۹۳۶: FAQ نوبت باز و متن عدم تأیید نوبت مشاهده شد؛ پنجره نصب باز شد، متن و چیدمان آن دیده شد و با «بعداً» بسته شد؛ سرریز افقی مشاهده نشد. خطاهای GPS، نصب واقعی سیستم‌عامل، offline واقعی و همه شرایط اتصال به‌طور end-to-end آزموده نشدند. آزمون‌های موجود تضمین کامل کیفیت متن یا دسترس‌پذیری نیستند.

وضعیت: COPY_EDITED / BUILD_TEST_LINT_PASS / DESKTOP_PARTIAL_QA / NOT_PUBLISHED. این سورس شامل اصلاح منتشرنشده dock از مرحله قبل است؛ گیت رندر موبایل هنوز برقرار است و انتشار بدون گذر از آن انجام نشد. لینک عمومی همان انتشار رنگی شماره ۴ است. نقطه ادامه: `RP-MINA-COPY-AND-DOCK-MOBILE-QA-PENDING`. پس از آزمون عرض‌های موبایل، همین سورس برای انتشار آماده‌سازی می‌شود؛ اتصال رزرو و AI همچنان به قرارداد سرویس واقعی وابسته‌اند.

## ممیزی تکمیلی تعامل و مقایسه — ۲۰۲۶-۰۹-۰۷

روی همان پروژه ادامه داده شد. نقص بازماندن راهنمای مینا پس از Escape در مرورگر بازتولید شد. در `app/site-client.tsx` انتقال فوکوس هنگام بازشدن راهنما، بستن با Escape، بازگشت فوکوس به دکمه راهنما و ارتباط aria-controls اضافه شد. بازگشت فوکوس پنجره نصب، در صورت حذف دکمه آغازکننده از DOM، اکنون مقصد جایگزین پایدار دارد.

ساخت رسمی و ۷ آزمون موجود موفق بودند؛ ESLint پس از اصلاح هشدار ref بدون خطا و هشدار کد اجرا شد. آزمون دیداری بعد از اصلاح کامل نشد: پیش‌نمایش ابتدا خاموش بود، با sites-preview فعال شد، سپس مرورگر بازکردن آن را با URL security policy رد کرد. هیچ مسیر جایگزینی برای دورزدن محدودیت استفاده نشد. این اصلاح‌ها تایید E2E یا انتشار ندارند. گیت موبایل ۳۲۰، ۳۹۰ و ۴۳۰ همچنان باز است.

کمبودهای باقی‌مانده از بررسی سورس: مدیریت خطا و جلوگیری از درخواست تکراری prompt نصب؛ دیده‌شدن پیام appinstalled پس از بسته‌شدن دیالوگ؛ حفظ فوکوس و اعلام آماده‌شدن لینک مسیر پس از مکان‌یابی. این موارد هنوز اصلاح یا در مرورگر بازتولید نشده‌اند. رزرو با شناسه پیگیری، هوش مصنوعی متصل و گزارش تحویل تبلیغات نیز فعال نیستند و به سرویس واقعی نیاز دارند.

مقایسه محتوایی با https://clinicmodern.com/ وجود صفحات خدمات، مقالات و گالری در آن مرجع را نشان داد؛ برای سایت حاضر محتوای تاییدشده و تصاویر دارای اجازه انتشار لازم است. این بررسی، اعتبار ادعاهای پزشکی یا عملکرد بک‌اند مرجع را تایید نمی‌کند. محتوای https://blubank.com/ کامل دریافت نشد و مقایسه دیداری آن تایید نشده است.

مهارت رسمی `security-best-practices` از مخزن openai/skills نصب شد؛ نصب به معنای اجرای ممیزی امنیتی نیست. مهارت طراحی impeccable در محیط موجود است، اما منابع تکمیلی آن قابل دریافت نبودند. وابستگی، schema، route و sync پروژه در این مرحله تغییر نکردند.

وضعیت: SOURCE_FIX_SAVED / BROWSER_POLICY_BLOCKED / MOBILE_QA_PENDING / NOT_PUBLISHED. انتشار عمومی همچنان نسخه رنگی شماره ۴ است. نقطه ادامه: `RP-MINA-GUIDE-FOCUS-BROWSER-QA-PENDING`.

## ادامه استانداردسازی تعامل — ۲۰۲۶-۰۹-۰۸

در پاسخ به درخواست تکمیل و آزمون، همان مخزن و وضعیت ثبت‌شده بررسی شد. نقص‌های مستند نصب در app/site-client.tsx اصلاح شدند: جلوگیری هم‌زمان از درخواست تکراری با ref و disabled؛ مدیریت خطا با try/catch/finally؛ مصرف یک‌باره رویداد نصب؛ تفکیک پذیرش درخواست از نصب واقعی؛ جلوگیری از بازنویسی پیام appinstalled با نتیجه دیرتر userChoice. پنجره باز نصب دیگر با appinstalled خودکار بسته نمی‌شود تا پیام نتیجه قابل مشاهده باشد؛ اگر کاربر قبلاً پنجره را بسته باشد، پیام عمومی خارج از پنجره هنوز وجود ندارد. ناحیه وضعیت نصب از ابتدا در دیالوگ رندر می‌شود. آماده‌شدن لینک مسیر به aria-live موجود اضافه شد؛ انتقال فوکوس مسیر هنوز حل نشده است.

ساخت رسمی پنج‌مرحله‌ای و اعتبارسنجی Worker موفق؛ ESLint بدون خطا یا هشدار کد؛ diff check موفق. آزمون‌های موجود فقط قرارداد سورس و رندر سرور را می‌سنجند و آزمون تعامل جدید یا نصب واقعی نیستند. محدودیت امنیتی قبلی مرورگر دور زده نشد و شاهد رفع آن وجود ندارد؛ آزمون موبایل و نصب واقعی همچنان NOT_VERIFIED. dependency، schema، route، sync و داده بیمار تغییر نکردند. محتوای تاییدنشده و اتصال نمایشی اضافه نشد.

وضعیت: INSTALL_SOURCE_HARDENED / BUILD_LINT_PASS / DEVICE_QA_STOP_BLOCKER / NOT_PUBLISHED. انتشار همچنان نسخه ۴ است. قدم بعدی: آزمون دستگاه برای رد/پذیرش/خطای نصب، کلیک تکراری، ترتیب appinstalled و userChoice، اعلان صفحه‌خوان و فوکوس؛ سپس رفع گیت موبایل پیش از انتشار. رزرو و AI به قرارداد سرویس واقعی نیاز دارند. نقطه ادامه: `RP-MINA-INSTALL-AND-ROUTE-DEVICE-QA-2026-09-08`.

## اصلاح فوکوس مسیریابی — ۲۰۲۶-۰۹-۰۸

در LiveRouteButton، دکمه هنگام دریافت موقعیت با aria-disabled و aria-busy قابل فوکوس می‌ماند؛ ref هم‌زمان از درخواست تکراری جلوگیری می‌کند. هنگام دریافت نتیجه، فقط اگر همان دکمه هنوز فوکوس داشته باشد، انتقال به لینک آماده درخواست می‌شود؛ پس از رندر نیز فقط در صورت بازگشت فوکوس به body انتقال انجام می‌شود تا فوکوس کنترل دیگری گرفته نشود. حالت انتظار موجود CSS با aria-disabled هماهنگ شد. خطای مکان‌یابی قفل درخواست را آزاد می‌کند. داده، مقصد نقشه، dependency، schema، route و sync تغییر نکردند.

ساخت رسمی و اعتبارسنجی Worker موفق؛ ESLint بدون خطا یا هشدار کد؛ diff check موفق. این شواهد اثبات اجرای فوکوس در مرورگر یا نصب روی گوشی نیستند؛ محدودیت امنیتی پیش‌نمایش قبلی و گیت موبایل برقرار است. آزمون لازم: نگه‌داشتن فوکوس روی دکمه تا آماده‌شدن، رفتن به کنترل دیگر پیش از پاسخ، تکرار درخواست و خطای مکان‌یابی، با صفحه‌کلید و صفحه‌خوان. وضعیت: ROUTE_FOCUS_SOURCE_FIXED / BUILD_LINT_PASS / BROWSER_QA_STOP_BLOCKER / NOT_PUBLISHED. نقطه ادامه: `RP-MINA-ROUTE-FOCUS-DEVICE-QA-2026-09-08`.

## نگهداری سورس در GitHub — ۲۰۲۶-۰۹-۰۸

با تایید صریح مالک، snapshot کامل ۴۴ فایل تحت Git از revision `2ce32ea23ed38a611fc4478eacd3c5ff4ff4f029` به مخزن `galaxy1364/SiteMinadental` منتقل شد. مقصد: `sites/dr-mina-mazandarani/` روی شاخه `transfer/work-site-20260908`؛ commit مقصد `194a46715fe8f61d64a47b7c92fd3dc8dce44b12`؛ درخواست ادغام پیش‌نویس https://github.com/galaxy1364/SiteMinadental/pull/14 . هش blob و mode هر ۴۴ فایل پس از انتقال با سورس برابر بود. همه ورودی‌های قبلی ریشه GitHub جز README که ثبت انتقال به آن افزوده شد، همان هش را دارند. هیچ فایل قبلی حذف یا runtime جایگزین نشد.

این انتقال snapshot است؛ تاریخچه اصلی در مخزن Sites و تاریخچه قبلی GitHub محفوظ‌اند، اما همه commitهای Sites به GitHub وارد نشده‌اند. همگام‌سازی پس‌زمینه فعال نیست. ادامه انتقال باید همین پوشه و همان PR را با Source revision و تطبیق هش به‌روز کند. push مستقیم ریشه سورس روی main مخزن GitHub ممنوع است؛ آن مخزن runtime و governance مستقل دارد. ادغام/انتشار انجام نشده است. این ثبت محلی پس از snapshot است و جزو revision انتقال‌یافته نیست. ممنوعیت‌های داده ساختگی و گیت آزمون موبایل برقرارند.

Resume: `RP-SITEMINADENTAL-WORK-SOURCE-TRANSFER-REVIEW-2026-09-08`.

## قابلیت‌های فعال و واقعی

- رابط فارسی و RTL واکنش‌گرا با لوگوی رسمی مالک؛
- تماس مستقیم و WhatsApp با شماره ثبت‌شده؛
- پین دقیق Google Maps ارسالی مالک و مسیرهای Google Maps، Waze، نشان و بلد؛
- PWA با manifest، حالت standalone، صفحه آفلاین و دعوت نصب متناسب با Android/iPhone؛
- بررسی Service Worker در هر ورود، هنگام بازگشت به صفحه، اتصال دوباره اینترنت و هر ۱۵ دقیقه؛
- فعال‌سازی خودکار Worker جدید و بارگذاری دوباره کنترل‌شده؛
- راهنمای تعاملی «مینا» برای نوبت، خدمات، مسیر و نصب؛
- انتقال کدهای `utm_source` و `utm_campaign` به پیام WhatsApp برای انتساب اولیه کمپین؛
- داده ساختاریافته Dentist بدون آمار، تضمین یا مدارک تأییدنشده.
- canonical، robots، sitemap و گراف ساختاریافته Dentist/WebSite با URL تولید؛
- محتوای محلی قابل‌مشاهده برای منطقه ۲۲ و FAQ همسان با محتوای واقعی صفحه؛
- نقشه آنلاین Google با مسیر رضایتی از موقعیت جاری کاربر و fallback به پین مالک؛
- صفحه ۴۰۴ واقعی با `noindex` برای جلوگیری از صفحات کم‌کیفیت در فهرست جست‌وجو.
- دعوت نصب غیرمسدودکننده پس از ۱۲ ثانیه، با دیالوگ دارای Escape، حلقه فوکوس و بازگشت فوکوس؛
- رویدادهای تبدیل بی‌نام برای تماس، واتساپ، مسیر و نصب از مسیر `mina:conversion` و `dataLayer` اختیاری؛ بدون ارسال خودکار داده یا اطلاعات پزشکی.

## مرز واقعی SEO

کدنویسی فنی، دسترسی‌پذیری، محتوای مفید و داده ساختاریافته فقط شرایط لازم را آماده می‌کنند و رتبه اول را تضمین نمی‌کنند. دسترسی سایت در ۲۰۲۶-۰۸-۰۵ عمومی شد؛ دامنه نهایی، Google Business Profile، نشان، بلد، Apple Business Connect، Bing Webmaster و Search Console هنوز باید توسط مالک ثبت/تأیید شوند تا هویت محلی و گزارش خزش کامل شود.

## مرز نوبت‌دهی آینده

تا زمان ارائه API واقعی، سایت رزرو موفقیت‌آمیز یا ذخیره اطلاعات بیمار را شبیه‌سازی نمی‌کند. مسیر فعلی تماس و WhatsApp است. اتصال آینده به برنامه مدیریت باید فقط از طریق API نسخه‌دار و مستقل انجام شود، نه اتصال مستقیم دیتابیس‌ها.

حداقل قرارداد موردنیاز اتصال آینده:

- `POST /v1/public/appointment-requests` با شناسه idempotency؛
- داده‌های حداقلی و رضایت صریح بیمار؛
- پاسخ دارای شناسه پیگیری واقعی و وضعیت `received`؛
- webhook امضاشده برای تأیید، تغییر زمان یا رد درخواست؛
- rate limit، ثبت ممیزی، حذف/نگهداری داده و جلوگیری از رزرو تکراری؛
- تنظیم endpoint و secret فقط از مسیر متغیرهای امن محیطی.

## مرز تبلیغات آینده

ارسال گروهی فقط پس از ارائه حساب و API رسمی هر کانال، رضایت مخاطب، لغو عضویت، Template تأییدشده، محدودیت نرخ و گزارش تحویل فعال می‌شود. هوش مصنوعی می‌تواند پیشنهاد متن، زمان و Segment بدهد، اما ارسال نهایی باید تأیید انسانی و Audit Log داشته باشد.

## بررسی‌های فعلی

```bash
node --test tests/site-contract.test.mjs
npm run lint
```

ساخت و اعتبارسنجی نهایی توسط چرخه رسمی Sites انجام می‌شود.

## اطلاعاتی که هنوز باید مالک تأیید کند

- دامنه نهایی و DNS؛
- ساعت کاری و آدرس پستی کامل؛
- درصد و شرایط کمپین تخفیف نصب؛
- شناسه رسمی Instagram، Telegram، Bale، Rubika و Eitaa؛
- مدارک، ادعاهای حرفه‌ای و تصاویر واقعی قابل انتشار؛
- API نوبت‌دهی، SMS/LBS و کانال‌های تبلیغاتی.


## سند مادر قبلی — سابقه محفوظ؛ وضعیت جاری در ابتدای فایل

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
