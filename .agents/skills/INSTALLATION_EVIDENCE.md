# MinaDent Agent Skills Installation Evidence

Installed on branch `agent/minadent-skills-foundation-20260804` on 2026-08-04.

## Installed project-local skills

- `minadent-evidence-first`
- `minadent-security-review`
- `minadent-verification-gate`
- `minadent-production-architecture`

## Installation boundary

These are instruction-only Agent Skills under `.agents/skills/`. They do not change application runtime, dependencies, database schema, routes, package lockfiles, deployment configuration, or approved UI.

## Research basis

The installation structure follows the open Agent Skills convention (`SKILL.md` with YAML frontmatter) and the project-local universal/Replit/Kimi path `.agents/skills/`. Selection principles were informed by the official OpenAI skills catalog and Vercel agent-skills guidance: repository-grounded planning, security threat modeling, deterministic verification, React/web performance, accessibility, and progressive disclosure.

## Explicit exclusions

External skills requiring scripts, browser downloads, package installation, network credentials, or incomplete multi-file reference trees were not copied. Installing a partial upstream skill would create false capability and is prohibited.

## Activation note

The consuming coding agent must support project-local Agent Skills and load `.agents/skills/**/SKILL.md`. No claim is made that GitHub itself executes these files.
