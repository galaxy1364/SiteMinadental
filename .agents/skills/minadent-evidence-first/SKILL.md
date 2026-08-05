---
name: minadent-evidence-first
description: Enforces repository-grounded, evidence-first execution for MinaDent. Use before any implementation, refactor, dependency, schema, route, deployment, or architectural change.
---

# MinaDent Evidence-First Execution

## Goal
Prevent guessed fixes, cross-project contamination, incomplete transfers, and unsupported claims.

## Mandatory workflow
1. Resolve the exact repository, branch, project path, and current commit.
2. Read governance and state files if present: `MASTER_PROJECT_STATE.md`, `STATUS.md`, `RESUME_STATE.md`, `AGENTS.md`, project instructions, and locked source-of-truth references.
3. Inspect the real implementation files related to the request.
4. Record evidence for architecture, dependencies, routes, data contracts, and blockers.
5. If evidence is insufficient, return `STOP_BLOCKER`; do not implement a workaround.
6. Make only the smallest in-scope change on a dedicated branch.
7. Run available deterministic checks and report exact results.
8. Report changed files, unverified items, current prohibition, next action, and resume point.

## Hard prohibitions
- No mock, fake, demo, placeholder, random feature, or speculative patch.
- No dependency, package, build, schema, database, route, native, sync, or deployment change without direct evidence and explicit scope.
- No parallel application, replacement architecture, or redesign.
- No deleting helpers, tests, Persian content, or validations merely to silence errors.
- No claim of completion without file-level evidence and verification output.

## Output contract
Always include: real status, evidence, changed files, checks performed, unverified work, blockers, current prohibition, next action, and resume point.
