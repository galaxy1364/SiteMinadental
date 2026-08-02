# Kimi Dental Website — Backend Deployment Evidence

**Audit date:** 2026-08-02  
**Repository:** `galaxy1364/SiteMinadental`  
**Branch:** `agent/site-connection-layer-v1`  
**Frontend visual change:** none

## Strict project boundary

This deployment belongs exclusively to the Kimi public dental website. The separate repository `galaxy1364/Minadental-base44` is a dental-management application and is not a dependency or destination of this backend.

## Deployed website backend

- Vercel project: `siteminadental-connection-v1`
- Vercel project ID: `prj_127hWTNen2G7qPGG45yuRNgE8a9e`
- Stable service URL: `https://siteminadental-connection-v1.vercel.app`
- Verified deployment ID before boundary rename: `dpl_AYfDD67d8L4cP1vPo871NqUVnBhq`
- Runtime: Node.js 24.x
- Build result: READY
- Custom clinic domain: not connected
- Public-site frontend: not changed

## Endpoints

- `GET /api/health`
- `GET /api/self-test`
- `POST /api/appointment`
- `POST /api/contact`
- `POST /api/assistant`

## Verified behavior

The Vercel self-test returned HTTP 200 and confirmed:

- Persian mobile digits normalize to ASCII `09...`.
- Invalid Iranian mobile input is rejected.
- Contact and assistant payload validation work.
- Fake success is blocked while the website CRM/backend webhook is absent.
- No patient data is stored or forwarded by self-test.

Security headers include no-store, nosniff, no-referrer, frame denial, restricted permissions and HSTS.

## Website-only credential gate

The following values are intentionally absent from Git and must refer only to website services:

- `ALLOWED_ORIGINS`
- `KIMI_SITE_WEBHOOK_URL`
- `KIMI_SITE_WEBHOOK_SECRET`
- `AI_GATEWAY_API_KEY`
- `AI_GATEWAY_MODEL`

No API returns an acceptance receipt until the configured website CRM/backend accepts the event.

## Frontend gate

The visible compiled forms still contain fake success handlers and are not yet connected to this API. The minified Bundle will not be patched. Connection requires maintainable source or a separately audited zero-visual-change bridge.

## Base44 exclusion correction

An accidental isolated Base44 branch temporarily contained one proposed entity file. That file was deleted before merge; comparison against Base44 `main` now returns an empty changed-file set. Base44 `main`, production data, UI and schema were never modified.

## Resume point

`RP-12-KIMI-SITE-BACKEND-LIVE-CRM-CREDENTIAL-AND-FRONTEND-BRIDGE-PENDING`
