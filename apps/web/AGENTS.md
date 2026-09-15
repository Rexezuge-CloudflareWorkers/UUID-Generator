# AGENTS.md - apps/web

`@uuid-generator/web`: Vite + TailwindCSS v4 + React 19 SPA. Built to `dist/`, served by the Worker (`apps/api`) or Pages.

## Layout

- Entry: `index.html` → `src/main.tsx` → `src/App.tsx` (single-page UUID dashboard).
- Data: one `GET /api/uuid/batch?randomCount=1&letterCount=1&numberCount=1` call on mount; dashless variants are derived client-side (`.replace(/-/g, '')`).
- `public/_routes.json` controls which paths hit the Pages Function (`/api/*`, `/docs`, `/openapi.json`) vs. served directly. `public/favicon.svg` is the tab icon wired in `index.html`.

## Commands (run in this dir)

```bash
pnpm run build     # Build for development (prettier + lint + build)
pnpm run release   # Build for production (clean + prettier + lint + build)
pnpm run prettier  # Format code
pnpm run lint      # Lint and fix
pnpm run typecheck # TypeScript check (tsc -b over tsconfig.app.json + tsconfig.node.json)
```

Prefer the root scripts (`pnpm run buildApp`, `pnpm run checks`) — they target this package via `--filter`.

## Conventions

- Keep the UI dependency-light (React + Tailwind only); no new runtime deps without discussion.
- Copy buttons: one labeled `Copy` button per row plus a global `With dashes` / `Without dashes` toggle (`role="group"`, `aria-pressed`), reusing the `copyToClipboard` helper. Displayed and copied values follow the toggle; buttons expose dynamic `aria-label`s.
- Accent color is blue (`blue-600`); favicon motif follows the same accent.
