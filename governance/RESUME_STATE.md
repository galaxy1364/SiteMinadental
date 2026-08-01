# RESUME STATE — SiteMinaDental

## Resume point

`RP-04-STATIC-AUDIT-COMPLETE-SOURCE-RECOVERY-PENDING`

## Continue from here

1. Work only in `galaxy1364/SiteMinadental`.
2. Do not modify `main` or deploy production.
3. Continue on Draft PR #3 and branch `agent/site-baseline-audit-20260802` for evidence/source recovery only.
4. Treat the supplied ZIP as compiled evidence, not maintainable source.
5. Preserve the recorded build and visual SHA-256 baselines.
6. Recover/export the 25 referenced TypeScript/React source files plus package manifest and lockfile.
7. Create a preview-only Git-backed deployment after source recovery.
8. Run visual regression at desktop and mobile sizes; reject every unapproved visual difference.
9. Implement appointment/contact persistence with server-side validation, idempotency, receipt ID, audit event and monitoring.
10. Connect MinaDent only through a versioned authenticated API contract.

## Immediate blocker evidence

- Repository source is absent.
- Vercel project is absent in the connected account.
- Both forms display success without a verified persistence endpoint.
- JSON-LD and embedded-map coordinates conflict by approximately 13.1 km.
- Instagram, Google Business Profile, Maps, domain, CRM and MinaDent credentials/contracts have not been supplied.
- PWA installation/update infrastructure is absent.

## Definition of safe continuation

Feature implementation becomes safe only after original source and preview deployment are proven. Until then, changes to minified assets, dependencies, routes, schemas, backend or production remain forbidden.
