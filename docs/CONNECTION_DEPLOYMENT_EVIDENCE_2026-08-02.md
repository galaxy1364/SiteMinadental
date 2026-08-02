# SiteMinaDental — Connection Deployment Evidence

**Audit date:** 2026-08-02  
**Repository branch:** `agent/site-connection-layer-v1`  
**Frontend visual change:** none

## Deployed connection service

- Vercel project: `siteminadental-connection-v1`
- Vercel project ID: `prj_127hWTNen2G7qPGG45yuRNgE8a9e`
- Stable service URL: `https://siteminadental-connection-v1.vercel.app`
- Verified deployment ID: `dpl_AYfDD67d8L4cP1vPo871NqUVnBhq`
- Runtime: Node.js 24.x
- Build result: READY
- Custom clinic domain: not connected
- Public-site frontend: not changed

## Verified public endpoints

- `GET /api/health`
- `GET /api/self-test`
- `POST /api/appointment`
- `POST /api/contact`
- `POST /api/assistant`

## Verified self-test result

`GET /api/self-test` returned HTTP 200 with all checks true:

- Persian mobile digits are normalized to ASCII `09...`.
- Invalid Iranian mobile input is rejected.
- Contact payload validation passes for valid input.
- Assistant payload validation passes for valid input.
- Fake success is blocked while MinaDent connection credentials are absent.

The self-test does not store or forward patient data.

## Verified health state

`GET /api/health` returned HTTP 200 and accurately reported:

- `minadent_webhook: false`
- `assistant: false`
- `allowed_origins: false`
- `durable_rate_limit: false`
- `production_ready: false`

This is an intentional credential gate, not a failed deployment.

## Security behavior

Verified response headers include:

- `Cache-Control: no-store`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: no-referrer`
- `X-Frame-Options: DENY`
- restricted `Permissions-Policy`
- Vercel HSTS

## MinaDent Base44 connection blocker

The existing Base44 `Appointment` entity requires internal authenticated roles for create access. Anonymous public website creation is not allowed. Therefore the website must not directly call the Appointment entity.

The design document defines future public booking operations (`availability`, `hold`, `confirm`, `waitlist`, `manage`), but no corresponding implemented Base44 public function or endpoint has been verified.

Required safe destination is one of:

1. an authenticated server-side MinaDent public-booking function implementing the versioned contract; or
2. a dedicated public lead/request entity with restricted server-side promotion into Appointment.

## Credential gate

The following values are intentionally absent from Git and Vercel:

- `ALLOWED_ORIGINS`
- `MINADENT_WEBHOOK_URL`
- `MINADENT_WEBHOOK_SECRET`
- `AI_GATEWAY_API_KEY`
- `AI_GATEWAY_MODEL`

No endpoint returns a successful acceptance receipt until its real upstream service is configured and accepts the request.

## Frontend gate

The visible compiled forms still contain fake success handlers. They are not connected to the deployed API. Changing the minified Bundle is prohibited. A frontend bridge requires either recovered maintainable source or a separately approved zero-visual-difference integration with visual-regression evidence.

## Resume point

`RP-11-LIVE-CONNECTION-SERVICE-READY-BASE44-PUBLIC-ENDPOINT-AND-FRONTEND-BRIDGE-PENDING`
