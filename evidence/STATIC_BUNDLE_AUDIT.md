# Static Bundle Audit — SiteMinaDental

**Audit date:** 2026-08-02  
**Audited input:** `Kimi_Agent_Deployment_牙科网站全程_v2.zip`  
**Method:** direct inspection of immutable HTML/CSS/JavaScript build artifacts; no source modification and no build/install operation.

## Executive result

The archive is a compiled React site, not maintainable source. It contains useful `code-path` metadata pointing to original TypeScript/React files, but those source files are absent. Directly editing the minified bundle is prohibited because it cannot provide safe, reviewable or durable implementation.

## Critical findings

### C-01 — Appointment form reports success without real delivery

The appointment submit handler performs this sequence:

1. Prevents the browser submit.
2. Sets a local loading flag.
3. Waits 1500 ms with `setTimeout`.
4. Displays: `نوبت شما با موفقیت ثبت شد!`.
5. Clears local form state.

No application API request, database write, CRM call, email delivery, MinaDent call, local storage write or WebSocket event is present in that handler.

Appointment fields present in local state:

- `name`
- `phone`
- `service`
- `date`
- `time`
- `message`

### C-02 — Contact form reports success without real delivery

The contact submit handler follows the same simulated pattern: a 1500 ms wait, a success toast and state reset. It does not prove any message was delivered.

Contact fields present in local state:

- `name`
- `email`
- `subject`
- `message`

### C-03 — Conflicting clinic coordinates

`index.html` JSON-LD declares:

- latitude: `35.7219`
- longitude: `51.3347`

The embedded Google Maps URL in the bundle uses approximately:

- latitude: `35.7245`
- longitude: `51.1897`

The two points are approximately 13.1 km apart. Neither coordinate may be corrected until the official Google Business Profile / Maps location is supplied and ownership is verified.

## Integration evidence

Only one `fetch(` token exists in the bundle and it belongs to React/resource preload runtime code. No application-level `axios`, `localStorage`, `sessionStorage` or `WebSocket` use was found.

Hard-coded external destinations found:

- Instagram: `https://instagram.com/drmazandarani`
- Telegram: `https://t.me/drmazandarani`
- WhatsApp: `https://wa.me/989105306142`
- Google Maps search/embed
- Neshan search
- Balad search
- Waze search
- Email: `galaxy.mehdi.m@gmail.com`
- Phone: `+989105306142`

These values are present in the compiled bundle but are not considered verified business ownership evidence.

## PWA / installation status

The supplied build does not include proven PWA installation infrastructure:

- no web app manifest
- no service worker
- no application icon set
- no offline policy
- no update lifecycle
- no install/update prompt contract

Therefore the site cannot honestly claim automatic installation suggestions or safe automatic app updates in its current state.

## Search and SEO status

The build contains title, meta description, canonical URL and Dentist JSON-LD. However:

- the site is a single bundled route
- there are no independently verified service/article URLs in the archive
- no standalone `sitemap.xml` is present
- no standalone `robots.txt` is present
- no Search Console, analytics or indexing ownership evidence is present
- business coordinates conflict
- several marketing statements require documentary evidence

No developer can guarantee first position in Google. Work may improve technical eligibility and measured search performance, but ranking depends on competition, content quality, authority, location, user signals and search-engine decisions.

## Original source paths recoverable from bundle metadata

The bundle references 25 original files:

- `src/App.tsx`
- `src/main.tsx`
- `src/pages/Home.tsx`
- `src/sections/About.tsx`
- `src/sections/Appointment.tsx`
- `src/sections/BeforeAfter.tsx`
- `src/sections/Blog.tsx`
- `src/sections/Contact.tsx`
- `src/sections/FAQ.tsx`
- `src/sections/Footer.tsx`
- `src/sections/Header.tsx`
- `src/sections/Hero.tsx`
- `src/sections/ScrollToTop.tsx`
- `src/sections/Services.tsx`
- `src/sections/Stats.tsx`
- `src/sections/Testimonials.tsx`
- `src/sections/WhyUs.tsx`
- `src/components/ui/accordion.tsx`
- `src/components/ui/button.tsx`
- `src/components/ui/dialog.tsx`
- `src/components/ui/input.tsx`
- `src/components/ui/label.tsx`
- `src/components/ui/select.tsx`
- `src/components/ui/sheet.tsx`
- `src/components/ui/textarea.tsx`

This metadata is useful for source recovery, but it is not sufficient to reconstruct source safely or prove original behavior.

## Missing contracts required for a real advanced implementation

- Versioned appointment/contact API
- Server-side validation and anti-spam controls
- Idempotency and duplicate submission prevention
- Traceable receipt ID shown only after durable storage
- CRM/MinaDent integration adapter
- Authentication, authorization and audit events
- Consent, privacy and retention policy
- Media ownership and Google/Instagram authorization
- Analytics and advertising consent
- Monitoring, alerting, backup and recovery
- Visual regression tests protecting the locked appearance
- Preview-to-production promotion and rollback process

## Safe remediation order

1. Recover the original source and lockfile.
2. Create preview-only deployment from the audit branch.
3. Capture visual baselines for desktop and mobile.
4. Add visual regression gate with zero unapproved visual difference.
5. Implement a server-side form receipt API and verify persistence.
6. Integrate MinaDent through a versioned API contract.
7. Verify Google Business Profile, social accounts, business claims and media rights.
8. Add PWA/update lifecycle only after source, icons, caching and rollback are defined.
9. Add SEO pages and structured data using verified facts.
10. Promote to production only after security, accessibility, performance and end-to-end tests pass.

## Current decision

`STOP_BLOCKER` remains active for feature implementation and production deployment. Static audit work is complete and no visual asset was changed.

## Resume point

`RP-04-STATIC-AUDIT-COMPLETE-SOURCE-RECOVERY-PENDING`
