<!-- .github/copilot-instructions.md -->
# Repo-specific instructions for Copilot / AI assistants

This file contains concise, actionable guidance for AI coding agents working in this SolidJS + Supabase web app. Use these rules when generating or editing code for the repository.

Key facts
- Tech stack: SolidJS (TSX/TypeScript), TailwindCSS, Vinxi dev tooling, Supabase (browser client), Google Maps JS API
- Package manager: pnpm. Node >= 22 is expected (see `package.json` engines)

How to run & verify locally
- Install deps: `pnpm install`
- Run dev server: `pnpm dev` (runs `vinxi dev`)
- Build: `pnpm build` (runs `vinxi build`)
- Start prod server: `pnpm start` (runs `vinxi start`)
- Typecheck: `pnpm run type-check`
- Lint + fix: `pnpm run fix` and `pnpm run lint`
- Full CI-style check: `pnpm run check` (runs lint + type-check)
- Quick health script for bots: `pnpm run copilot:check` (prints pass/fail)

Environment variables & local dev notes
- The app expects the following VITE_ env vars (see `src/utils/env.ts`):
  - `VITE_GOOGLE_MAPS_API_KEY`
  - `VITE_GOOGLE_MAPS_MAP_ID`
  - `VITE_PUBLIC_SUPABASE_ANON_KEY`
  - `VITE_PUBLIC_SUPABASE_URL`
- If a `.env` is not present, create one locally with those keys. The code calls `validateEnvVars()` and will throw if they are missing.

Project layout & important files to reference
- `src/` — application source. Key subtrees:
  - `src/modules/collection-points/` — domain logic, types and UI for collection points (see `types.ts`, `hooks/`, `sections/`)
  - `src/modules/map/` — Google Maps integration and hooks (e.g. `useGoogleMapsScript.ts`, `useGooglePlacesService.ts`, `CollectionPointsMap.tsx`)
  - `src/shared/infrastructure/supabase/` — Supabase client + generated types. Generated types are written to `src/shared/infrastructure/supabase/database.types.ts` by the `supabase:gen-types` script
  - `src/components/ui/` — small design-system primitives used across the app (Button, Input, Card, etc.)
  - `src/routes/` — route components used by the router
  - top-level data fixtures: `src/collectionPoints.json`, `src/poi.json`, `src/wasteTypes.json` used for local dev and examples

Coding patterns & conventions (concrete, enforceable)
- SolidJS idioms: components use signals, memos and effects. Do NOT destructure signals — call them as functions (e.g. `count()`), prefer `createSignal`, `createMemo`, `createEffect`. See `src/modules/collection-points/hooks/useCollectionPointsFilter.ts` for an example.
- Use `<For>` and `<Show>` instead of `.map` and `&&` in JSX. Keep components small and pure; move logic to hooks or utils.
- File & component naming: PascalCase for components (e.g. `CollectionPointsMap.tsx`), hooks in `hooks/` folder (e.g. `useGoogleMapsScript.ts`).
- Imports: follow repository ESLint and import sorting rules (see `.github/instructions/eslint.instructions.md`). Keep imports grouped and alphabetized (simple-import-sort is configured).
- No barrel/index re-exports for ease of refactoring and clarity (project pattern uses direct imports).

Integration details & gotchas
- Google Maps: the app dynamically loads the Maps JS API via `useGoogleMapsScript(apiKey)`. If the API key or `maps` global is missing, map components will no-op or warn.
- Supabase: browser client lives under `src/shared/infrastructure/supabase/supabase.ts`. When regenerating types use `pnpm run supabase:gen-types` — it will append to `database.types.ts` and run `pnpm run fix`.
- Tailwind: styles live in `src/app.css`. There is a `tw:build` script for debugging Tailwind output.

What to avoid / conservative defaults for AI edits
- Do not change global architecture (moving modules between `src/modules/*` and other top-level folders) without an explicit PR description.
- Avoid introducing new runtime dependencies without updating `package.json` and `pnpm-lock.yaml` and explaining why.
- When modifying map/supabase code, preserve fallback behavior: dynamic script loading, feature-detection for `globalThis.google`, and defensively checking env vars.

When adding or modifying code, run these checks locally
1. `pnpm run type-check`
2. `pnpm run lint` (and `pnpm run fix` to autofix when appropriate)
3. `pnpm dev` and exercise affected pages (maps, collection points) to verify UI and console for runtime errors

References
- ESLint / style hints: `.github/instructions/eslint.instructions.md`
- SolidJS-specific guidance: `.github/instructions/solidjs.instructions.md`

If something is unclear, ask for: the exact route or component to change, expected user-visible behavior, and whether the change should be backward compatible with existing fixtures in `src/*.json`.
