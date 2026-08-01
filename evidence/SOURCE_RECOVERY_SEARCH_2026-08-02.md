# Source Recovery Search — SiteMinaDental

**Date:** 2026-08-02

## Scope

Read-only search for the maintainable source of the public SiteMinaDental website across the owner's related GitHub repositories and the supplied deployment archive.

## Verified results

- `galaxy1364/SiteMinadental` is the correct website repository but initially contained only `README.md`.
- `galaxy1364/Minadental-base44` is a Base44 clinic application and is not the public website.
- `galaxy1364/Mina-Dental2026` is an Expo/React Native MinaDent application and is not the public website.
- `galaxy1364/mina-dent` is a Next.js clinic application redirecting to `/dashboard`; it is not the public website.
- `galaxy1364/minadent` contains an old standalone internal appointment form and does not match the supplied public website Build.
- Other likely repository names did not expose files or strings matching the supplied website's exact section paths, telephone number, Persian hero text, or image names.
- The supplied ZIP has no `src/`, package manifest, lockfile, source map, `sourcesContent`, or Vite manifest.

## Bundle evidence

The compiled JavaScript preserves 25 original path annotations, including:

- `src/sections/Header.tsx`
- `src/sections/Hero.tsx`
- `src/sections/Stats.tsx`
- `src/sections/About.tsx`
- `src/sections/Services.tsx`
- `src/sections/WhyUs.tsx`
- `src/sections/BeforeAfter.tsx`
- `src/sections/Appointment.tsx`
- `src/sections/Testimonials.tsx`
- `src/sections/Blog.tsx`
- `src/sections/FAQ.tsx`
- `src/sections/Contact.tsx`
- `src/sections/Footer.tsx`
- `src/pages/Home.tsx`
- `src/App.tsx`
- `src/main.tsx`

These annotations prove the former source structure but do not contain the original maintainable source files.

## Decision

The original source is not currently recoverable from connected GitHub evidence. No unrelated MinaDent repository may be copied into SiteMinaDental. The exact compiled Build may be preserved byte-for-byte as a deployment baseline on a separate branch, but it must not be represented as recovered source.

## Resume point

`RP-05-SOURCE-SEARCH-COMPLETE-BYTE-EXACT-BASELINE-NEXT`
