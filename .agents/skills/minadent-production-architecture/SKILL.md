---
name: minadent-production-architecture
description: Guides MinaDent toward a real reusable production application shell grounded in domain workflows, data, navigation, synchronization, security, and auditability.
---

# MinaDent Production Architecture

## Foundation definition
Foundation means a production application shell and reusable framework, not decorative UI. Architecture must be derived from actual domain entities, workflows, data ownership, navigation, offline or sync behavior, authorization, and audit requirements.

## Required order
1. Inspect existing architecture and locked visual behavior.
2. Establish entities, relationships, identifiers, ownership, state machines, and invariants.
3. Trace the unified patient journey from lead through record, appointment, attendance, diagnosis, treatment plan, treatment, laboratory, finance, follow-up, and closure.
4. Define commands, validation, authorization, audit events, idempotency, error states, and recovery.
5. Reuse the existing shell and approved components; upgrade in place.
6. Implement only live actions with real handlers and explicit states.
7. Verify end-to-end behavior before claiming completion.

## UI and workflow constraints
- Persian-first, RTL, accessible, responsive, and operationally scannable.
- Patient-based operational views; no decorative or category-only cards.
- Stage-aware details expose only relevant next actions.
- No dead button, fake data, hard-coded workflow, duplicate route, or parallel dashboard.
- Preserve approved appearance unless redesign is explicitly requested.

## Architecture quality gate
Every proposed component must identify its domain purpose, source data, commands, permission, audit event, loading and failure states, navigation behavior, and verification method.
