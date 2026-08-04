---
name: minadent-verification-gate
description: Requires deterministic verification and honest completion reporting for every MinaDent change.
---

# MinaDent Verification Gate

## Before editing
- Confirm target branch and allowed files.
- Capture baseline behavior and available checks.
- Define observable acceptance criteria tied to the user's request.

## After editing
Run only repository-supported checks. Prefer, when available:
1. type checking;
2. unit and integration tests;
3. lint or static analysis;
4. build verification;
5. route or API contract checks;
6. browser or device verification for changed user flows;
7. security checks for sensitive paths.

Do not install tools or dependencies merely to create a green result.

## Failure rules
- Never hide, suppress, delete, or weaken a failing check without evidence that the check itself is invalid.
- Never report a test as passed unless its command and result were observed.
- Distinguish `passed`, `failed`, `not run`, `not available`, and `blocked`.
- A build passing does not prove runtime, data, navigation, sync, or workflow correctness.

## Completion gate
A task is complete only when acceptance criteria are verified. Otherwise report partial completion with exact blocker and resume point.

## Required report
- baseline;
- changed files;
- commands or checks executed;
- exact results;
- user-visible behavior verified;
- unverified risks;
- rollback boundary;
- next action and resume point.
