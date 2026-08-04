---
name: minadent-security-review
description: Performs repository-grounded security review for MinaDent patient, identity, financial, audit, notification, and integration flows.
---

# MinaDent Security Review

## Scope
Use for authentication, authorization, patient data, financial records, audit logs, uploads, notifications, APIs, database access, and third-party integrations.

## Required method
1. Identify real entry points, trust boundaries, actors, secrets, stores, and outbound integrations from repository files.
2. Trace authorization and validation from request to persistence and response.
3. Check least privilege, tenant or clinic isolation, RBAC enforcement, object-level authorization, input validation, output encoding, secret handling, logging, and failure behavior.
4. Identify abuse paths with exact file evidence and realistic impact.
5. Rank findings by exploitability and impact; do not inflate theoretical issues.
6. Never modify security-sensitive code without a verified reproduction, approved scope, and deterministic tests.

## MinaDent invariants
- Patient and clinical data must never leak across users, roles, clinics, exports, logs, notifications, or caches.
- Financial mutations require authorization, validation, auditability, and idempotency where relevant.
- Audit records must not be silently mutable or bypassed.
- No secret, token, credential, medical detail, or personal identifier in client bundles or unsafe logs.
- Deny by default when identity, ownership, or permission evidence is missing.

## Output
For each finding provide: severity, evidence path, affected asset, attack path, impact, existing control, missing control, safe remediation, and required verification.
