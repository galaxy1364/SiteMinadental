# MinaDent Public Booking Contract — 2026-08-01

## هدف
اتصال سایت Kimi به تقویم واقعی MinaDent بدون قرار دادن توکن، منطق ظرفیت یا داده درمانی در مرورگر.

## اصول
- credential فقط سرور
- رزرو قطعی فقط با Slot واقعی و Hold معتبر
- Idempotency Key برای همه عملیات write
- ISO-8601 و timezone برابر Asia/Tehran
- عدم ساخت Slot یا تأیید جعلی
- fallback به Request و واتساپ هنگام قطعی
- عدم دریافت اطلاعات پزشکی حساس در فرم عمومی

## مسیرها
- GET /public/booking/availability
- POST /public/booking/hold
- POST /public/booking/confirm
- POST /public/booking/waitlist
- POST /public/booking/manage

## مدیریت
manageToken باید کوتاه‌عمر یا قابل ابطال باشد و در URL عمومی، analytics یا localStorage ذخیره نشود.

## Conversion Events از MinaDent
lead_created، qualified_lead، appointment_confirmed، attended، treatment_accepted و payment_received از endpoint سروری /api/conversion و header محرمانه x-conversion-secret عبور می‌کنند.
