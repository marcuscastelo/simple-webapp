## Quick context
<language>English</language>
DO NOT WRITE ANY MARKDOWN OR CODE IN PORTUGUESE OR ANY LANGUAGE OTHER THAN ENGLISH

This repository is a small two-tier web app: a Python FastAPI backend (backend/) that accepts Excel uploads and a SolidStart-based frontend (`frontend/`) built with Vinxi/solid-start. The backend uses a `src/` layout and the project includes Docker Compose for local orchestration.

Canonical entry points:
- Backend app: `backend/src/spreadsheet-analysis/main.py` (FastAPI `app`).
- Backend routes: `backend/src/spreadsheet-analysis/api/routes.py` (POST `/upload`).
- Backend settings: `backend/src/spreadsheet-analysis/core/config.py` (pydantic settings).
- Frontend app: `frontend/` (see `frontend/package.json`).
- Orchestration: `docker-compose.yml` and `backend/Dockerfile`.

## High-level architecture

- Backend runs as a small REST service that accepts Excel uploads and uses pandas (openpyxl) to parse sheets and return columns/row counts.
- Frontend is a Vinxi/SolidStart app that runs separately; in dev both services are commonly started together via Docker Compose or the frontend dev server is proxied to the backend.

## Repo philosophies & rules (from past projects)

- Barrel-file ban (frontend TS/JS): do not create or use barrel index files that re-export modules. Import directly from the file path.

## Docker / compose guidance (practical rule)

- Use the repository root `docker compose` (or `docker-compose`) workflow. When building or running a single service, prefer:

  docker compose build <service-name> (e.g. spreadsheet-analysis-backend)
  docker compose up -d --build --force-recreate --remove-orphans <service-name> (e.g. spreadsheet-analysis-backend)

  IMPORTANT: ALWAYS USE THESE FLAGS WHEN STARTING SERVICES:
  `docker compose up -d --build --force-recreate --remove-orphans`

  Avoid using `-f` to point at a service-specific compose file because service compose files may rely on includes, shared networks, or root-level configuration. Building with the root compose preserves expected networks and healthcheck wiring.

CSS Policy (Tailwind-only)

- THIS REPO USES TAILWIND FOR ALL STYLING. Do NOT create new custom CSS classes or add component-scoped stylesheet files.
- Use Tailwind utility classes in markup (JSX/TSX) for all styling and responsive behavior. If you need a small reusable value, prefer design tokens or Tailwind config extensions rather than custom CSS classes.

## Developer workflows (concrete)

- Quick dev with Docker Compose (starts frontend and backend):
  - docker compose up --build

- Backend locally:
  - cd backend
  - poetry install
  - poetry run uvicorn ${APP_MODULE:-myapp.main:app} --host 0.0.0.0 --port 8000

- Frontend locally:
  - cd frontend
  - pnpm install  # or npm install
  - pnpm run dev

- Tests (backend):
  - cd backend
  - poetry run pytest

## Patterns & conventions to follow

- Small, single-responsibility modules: backend keeps routes in `api/`, settings in `core/`.
- Use Pydantic models for request/response shapes (see `UploadResponse` in `api/routes.py`).
- File uploads use `UploadFile`; handlers call `file.file` and attempt `seek(0)` prior to passing to pandas.
- Keep pandas processing synchronous (CPU-bound); for large jobs prefer background workers.

## Integration & safety notes

- The upload handler uses `pd.read_excel(..., engine="openpyxl")` — ensure `openpyxl` is present in the environment when running tests or CI.
- Dockerfile sets `PYTHONPATH=/app/src:/app`. Mirror that locally (for example `export PYTHONPATH=backend/src:backend`) if not using Poetry's environment.
- Check `frontend/tsconfig.json` for `vinxi` types if you change frontend typings.

## Small actionable examples

- Example curl to exercise `/upload` locally (replace port/path as needed):

  curl -v -F "file=@example.xlsx;type=application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" http://localhost:8000/upload

## Files worth opening first

- `backend/src/spreadsheet-analysis/main.py` — FastAPI app setup
- `backend/src/spreadsheet-analysis/api/routes.py` — upload endpoint and pydantic model examples
- `backend/Dockerfile`, `docker-compose.yml` — service run and build rules
- `frontend/package.json` and `frontend/README.md` — frontend scripts and dev tips

## Solid reactivity rule (project-specific)

- Do NOT destructure component props in Solid components (for example `const { x } = props` or `function Comp({ x })`) because destructuring breaks Solid's fine-grained reactivity and can prevent updates from propagating. Always access props via `props.x` or assign local consts that reference `props.x` (e.g. `const x = props.x`) when necessary.

Files changed to follow this rule:

- `frontend/src/components/selectable-table/Header.tsx`
- `frontend/src/components/selectable-table/Cell.tsx`
- `frontend/src/components/selectable-table/SelectionOverlay.tsx`

Follow-up: If you need automated linting for this pattern, consider adding an ESLint rule or codemod to enforce non-destructuring of props in Solid components.

Additional guidance (derived accessors):

- Prefer using arrow-derived accessors for prop values that are read by components, for example:

  const count = () => props.count;

  This creates a tiny derived accessor that Solid can track when used in JSX or computations. For event handlers or functions passed in props, you can keep direct references (e.g. `const onClick = props.onClick`).

- Recent changes were applied to enforce this pattern in these files: `Header.tsx`, `Cell.tsx`, `SelectionOverlay.tsx`.

DO NOT WRITE ANY MARKDOWN OR CODE IN PORTUGUESE OR ANY LANGUAGE OTHER THAN ENGLISH