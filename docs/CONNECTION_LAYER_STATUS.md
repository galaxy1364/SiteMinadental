# Kimi Dental Website Backend Status

## Project boundary

This backend belongs only to the Kimi public dental website in `galaxy1364/SiteMinadental`.
It has no dependency on, write access to, or contract with the separate Base44 dental-management application.

## Verified implementation

- Server-only appointment-request and contact gateways for the public website.
- Strict Iranian mobile validation: `^09[0-9]{9}$` after Persian/Arabic digit conversion.
- HMAC-SHA256 signed events to a future website CRM/backend webhook.
- Idempotency key and request ID propagation.
- Eight-second upstream timeout and explicit 502 errors.
- No success response while the website backend connection is unconfigured or rejects the event.
- Safety-gated Persian website assistant endpoint.
- CORS allowlist, no-store responses and security headers.
- Dependency-free Node.js 24 contract tests and GitHub Actions CI.

## Not yet connected

The following server-only values are intentionally absent from Git:

- `ALLOWED_ORIGINS`
- `KIMI_SITE_WEBHOOK_URL`
- `KIMI_SITE_WEBHOOK_SECRET`
- `AI_GATEWAY_API_KEY`
- `AI_GATEWAY_MODEL`

## Frontend gate

The compiled public-site Bundle still contains fake success handlers. The new endpoints must not be described as connected to the visible forms until either:

1. the original maintainable frontend source is recovered, or
2. a separately audited, non-visual integration bridge is approved and visual regression passes.

## Production gate

A real website CRM/backend destination, durable distributed rate limit, consent policy, retention policy, monitoring and official domain/origin ownership must be configured before public production traffic.

## Explicit exclusion

`galaxy1364/Minadental-base44` is a separate clinic-management project and is outside this website scope. No Base44 entity, function, schema or credential may be added or changed as part of this website project unless the owner explicitly starts a separate integration project.

## Resume point

`RP-12-KIMI-SITE-BACKEND-LIVE-CRM-CREDENTIAL-AND-FRONTEND-BRIDGE-PENDING`
