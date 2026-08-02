# SiteMinaDental Connection Layer Status

## Verified implementation

- Server-only appointment and contact gateways.
- Strict Iranian mobile validation: `^09[0-9]{9}$` after Persian/Arabic digit conversion.
- HMAC-SHA256 signed MinaDent/CRM webhook events.
- Idempotency key and request ID propagation.
- Eight-second upstream timeout and explicit 502 errors.
- No success response while the upstream connection is unconfigured or rejects the event.
- Safety-gated Persian AI assistant endpoint.
- CORS allowlist, no-store responses and basic security headers.
- Dependency-free Node 20 contract tests and GitHub Actions CI.

## Not yet connected

The following server-only values are intentionally absent from Git:

- `ALLOWED_ORIGINS`
- `MINADENT_WEBHOOK_URL`
- `MINADENT_WEBHOOK_SECRET`
- `AI_GATEWAY_API_KEY`
- `AI_GATEWAY_MODEL`

## Frontend gate

The compiled public-site Bundle still contains fake success handlers. The new endpoints must not be described as connected to the visible forms until either:

1. the original maintainable frontend source is recovered, or
2. a separately audited, non-visual integration bridge is approved and visual regression passes.

## Production gate

A durable distributed rate limit, consent policy, retention policy, monitoring and official domain/origin ownership must be configured before public production traffic.

## Resume point

`RP-10-CONNECTION-API-DEPLOYED-CREDENTIAL-AND-FRONTEND-BRIDGE-GATE`
