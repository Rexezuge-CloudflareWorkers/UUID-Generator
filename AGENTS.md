# AGENTS.md - UUID-Generator

Guidance for agents working in UUID-Generator. This is the global index — follow the links to scoped sub-guides before working in an area.

## Overview

UUID-Generator is a Cloudflare Worker backend (Hono + Chanfana + Zod) + Vite React SPA in a pnpm workspace (`@uuid-generator/monorepo`, `packageManager: pnpm@11.2.2`), following the `../Otter` package layout (`apps/*` + `packages/*`, `@uuid-generator/*` scope).

- **API**: `apps/api` (`@uuid-generator/api`) serves Hono/Chanfana routes and the SPA shell. See `apps/api/AGENTS.md`.
- **Web**: `apps/web` (`@uuid-generator/web`) is the Vite + TailwindCSS v4 + React 19 SPA. See `apps/web/AGENTS.md`.
- **Shared**: `packages/uuid-core` (`@uuid-generator/uuid-core`) holds the UUID generation logic with zero dependencies; the API depends on it via `workspace:*`.
- **Pages proxy**: root `functions/[[path]].ts` proxies `/api/*`, `/docs`, `/openapi.json` to the Worker via service binding `API_WORKER` — no external HTTP calls.

## Commands

Plain `pnpm` is canonical (Node 24).

```bash
pnpm install
pnpm run checks   # pnpm -r typecheck + web lint + vitest
pnpm run build    # pnpm -r build; only @uuid-generator/web has a build script
pnpm run buildApp # web release build (prettier + lint + build) to apps/web/dist
pnpm run cf-typegen  # after changing wrangler bindings (uses apps/api/wrangler.jsonc)
pnpm exec wrangler dev --config ./apps/api/wrangler.jsonc
pnpm exec wrangler deploy --config ./apps/api/wrangler.jsonc
```

Notes: `apps/api/wrangler.jsonc.template` is the config template — `wrangler.jsonc` is generated (gitignored) by `scripts/prepare-wrangler-config.ts` from the `WRANGLER_JSONC` var or the template.

## Index

| Area                          | Guide              |
| ----------------------------- | ------------------ |
| API worker, auth, routes      | `apps/api/AGENTS.md` |
| Web SPA, UI text conventions  | `apps/web/AGENTS.md` |
| Bindings, wrangler, env vars  | `apps/api/AGENTS.md` (Wrangler section) |
| Tests, typecheck, lint        | Commands above     |

## Keeping AGENTS.md Current

Update the scoped sub-guide as part of any change that adds, removes, or renames (update this index only when adding a new guide or top-level feature):

- Routes, endpoints → `apps/api/AGENTS.md`
- Web UI → `apps/web/AGENTS.md`
- Shared generation logic → `packages/uuid-core` (no guide; keep `src/index.ts` exports tidy)
- Env vars, bindings → `apps/api/AGENTS.md`
- Workspace layout, scripts, CI → this file

## Commit Policy

Always commit changes after completing work unless explicitly told not to.

## Git Commit Messages

Format: `<TYPE>[optional scope]: <description>`

- Type in UPPERCASE: `FIX`, `FEAT`, `DOCS`, `STYLE`, `REFACTOR`, `TEST`, `BUILD`, `CHORE`, `CI`, `PERF`.
- Scope in lowercase: `FEAT(runtime): Add Scheduled Job State`.
- Description: Title Case words — `DOCS: Latest Agents Context Reflection`.
- When committing from `main`, first create a branch: `type/description` or `type/scope/description` in kebab-case (e.g. `feat/bootstrap/bootstrap-jqanywhere-v0.1-framework`).
- Always include a Markdown body separated from the subject by a blank line.
- Breaking changes: `!` after type/scope, or `BREAKING CHANGE: <description>` footer.

```text
<TYPE>[optional scope]: <description>

[Markdown body]

[optional footers]
```
