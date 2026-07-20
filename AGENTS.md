# AGENTS.md - UUID-Generator

## Project Structure

This is a dual-package monorepo (pnpm workspace):
- **Root**: Cloudflare Worker backend (Hono + Chanfana + Zod)
- **`app/`**: React frontend (Vite + TailwindCSS v4 + React 19)

## Key Commands

```bash
# Generate Cloudflare types (after wrangler.jsonc exists)
pnpm run cf-typegen

# Build frontend only
pnpm run buildApp

# Full build for deployment
pnpm run predeploy

# Deploy to Cloudflare (requires wrangler.jsonc with secrets)
pnpm run deploy

# Local development
pnpm run dev

# Run checks (typecheck + lint + test)
pnpm run checks
```

**Frontend commands** (in `app/` directory):
```bash
cd app/
pnpm run build        # Build for development
pnpm run release     # Build for production (prettier + lint + build)
pnpm run prettier    # Format code
pnpm run lint        # Lint and fix
pnpm run typecheck   # TypeScript check
```

## Important Configuration

- **wrangler.jsonc**: Not committed (in `.gitignore`). Template at `wrangler.jsonc.template`. Secrets are stored in GitHub Actions vars/secrets and dumped at deploy time via `scripts/prepare-wrangler-config.ts`.
- **wrangler.pages.jsonc**: Not committed (in `.gitignore`). Template at `wrangler.pages.jsonc.template`. For Pages deployment with service binding.
- **Frontend env**: No longer used. `VITE_OPTIONAL_BACKEND_URL` has been removed in favor of the Pages Function proxy pattern.

## Architecture Notes

- **Backend entry**: `src/index.ts` — Hono app with CORS, OpenAPI docs at `/docs`
- **API endpoint**: `/api/uuid` with query params: `count`, `startWithLetter`, `startWithNumber`
- **Frontend**: Vite + React 19 + TailwindCSS v4. Built to `app/dist/`, served by Worker or Pages.
- **Pages Function proxy**: `functions/[[path]].ts` proxies `/api/uuid`, `/docs`, `/openapi.json` to the Worker via service binding `API_WORKER` — no external HTTP calls.
- **Pages routing**: `app/public/_routes.json` controls which paths hit the function vs. served directly.

## CI/CD

- **Two deploy workflows**: `continuous-deployment.yml` (contains `deploy-worker` and `deploy-pages` jobs)
- Both trigger on CI completion or manual dispatch
- **Node version**: 24 (used in CI and locally)
- **Pages deployment**: Uses `wrangler.pages.jsonc` (generated from template or `WRANGLER_PAGES_JSONC` var) for service binding configuration. The `API_WORKER` binding connects Pages to the Worker.

## TypeScript Configs

- Root `tsconfig.json`: For backend (`src/`), excludes `app/`
- `app/tsconfig.json`: Project references (`tsconfig.app.json`, `tsconfig.node.json`)
