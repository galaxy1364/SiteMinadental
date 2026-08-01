# Content, Claims and External Integration Audit

**Date:** 2026-08-02  
**Source:** supplied compiled Build; no source reconstruction

## P0 — Service-scope contradiction

The public Build advertises orthodontic services in multiple locations:

- `زیبایی دندان` description includes orthodontics.
- Feature list includes `ارتودنسی نامرئی`.
- Before/after portfolio includes `ارتودنسی نامرئی` and `اصلاح نامرتبی شدید دندان‌ها در ۱۸ ماه`.
- Category filter includes `ارتودنسی`.
- Asset `service-orthodontics.jpg` is used for both orthodontics and emergency-service content.

The established clinic scope states that the clinic provides almost all dental services **except orthodontics**. Therefore this content is currently contradictory and must not be preserved as an approved factual claim without a documented scope change.

## P0 — Unverified clinical and commercial claims

The Build presents the following claims as facts without a connected evidence source:

- `۱۵+ سال تجربه تخصصی`
- `۵۰۰۰+ بیمار راضی`
- `۹۸٪ رضایت بیماران`
- `مدرک تخصصی از آلمان، دبی و ایران`
- `ضمانت ۱۰ ساله` for implants
- `ضمانت ۵ ساله` for laminate/composite
- `درمان تک جلسه‌ای با ضمانت`
- `پاسخگویی ۲۴ ساعته`
- `بالاترین سطح علمی دندانپزشکی`
- `سئو و رتبه اول گوگل`
- `با اولین جستجو در گوگل و اینستاگرام، ما را پیدا خواهید کرد`

Each claim requires an approved evidence record, scope, terms, date and owner before production publication.

## P0 — Fake submission success

Appointment and contact forms do not call a verified API, CRM, email service, database or MinaDent endpoint. They only wait approximately 1.5 seconds and show success/reset state. User data can therefore be lost while the interface reports success.

## P1 — External identities require ownership verification

Hard-coded links found in the Build:

- WhatsApp: `https://wa.me/989105306142`
- Telegram: `https://t.me/drmazandarani`
- Instagram: `https://instagram.com/drmazandarani`
- Canonical domain: `https://drmazandarani.ir`

No ownership token, Business account authorization, API credential, redirect verification or approval record is connected to the repository.

## P1 — Map and address conflict

- JSON-LD coordinates: `35.7219, 51.3347`
- Embedded map coordinates: approximately `35.7245, 51.1897`
- Distance between the points: approximately 13.1 km.
- Text address: `تهران، منطقه ۲۲، خیابان امیرکبیر، گلها، نبش یاس`.

The location must be resolved from the official Google Business Profile / Maps listing before updating Schema, maps or navigation links.

## P1 — SEO/PWA gaps

- No verified `robots.txt` or `sitemap.xml` artifact in the supplied package.
- No PWA manifest, service worker, install icons or update lifecycle.
- No `og:image` / Twitter image.
- No favicon package.
- No real article routes or content management evidence.
- Canonical domain ownership and live deployment are not verified.
- No Search Console, analytics, consent or conversion evidence.

## Current prohibition

Do not silently edit these claims in the minified Bundle. Corrections require maintainable source, approved factual data and visual-regression protection.

## Resume point

`RP-08-CLAIMS-AUDITED-ASSET-TRANSFER-AND-SOURCE-PENDING`
