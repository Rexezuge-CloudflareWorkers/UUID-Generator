# AGENTS.md - apps/api

`@uuid-generator/api`: Cloudflare Worker backend (Hono + Chanfana + Zod). Also serves the SPA shell (`apps/web/dist`) as static assets.

## Layout

- Entry: `src/index.ts` — Hono app with CORS, OpenAPI docs at `/docs`.
- Endpoints: `src/endpoints/api/uuid/get.ts` (`GET /api/uuid`: `count`, `startWithLetter`, `startWithNumber`), `src/endpoints/api/uuid/batch.ts` (`GET /api/uuid/batch`: `randomCount`, `letterCount`, `numberCount`, total capped at 200).
- Generation logic lives in `@uuid-generator/uuid-core` — import from there, never duplicate it here.
- Tests: colocated `src/**/*.test.ts`, run from the repo root via vitest.

## Wrangler

- Template: `wrangler.jsonc.template` (in this dir). `wrangler.jsonc` is generated and gitignored — run `pnpm run prepare-wrangler-config` from the repo root (uses the `WRANGLER_JSONC` var or the template).
- `main: src/index.ts`, static assets: `../web/dist` (built by `@uuid-generator/web`).
- Typegen: `pnpm run cf-typegen` from the repo root writes `worker-configuration.d.ts` (gitignored) using this dir's config; this package's `tsconfig.json` includes it.
- Never run `wrangler deploy`/`dev` from inside this dir without `--config`; root scripts pass `--config ./apps/api/wrangler.jsonc` for you.

## Conventions

- New endpoints: add a `OpenAPIRoute` class under `src/endpoints/`, export it from `src/endpoints/index.ts`, register it in `src/index.ts`.
- Validate query params with Zod (`safeParse`, `400` on failure) following the existing routes.
- Keep the legacy `serveStatic` line in `src/index.ts` untouched (manifest-based; keys are filename-relative and unaffected by repo layout).
