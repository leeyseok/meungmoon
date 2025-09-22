# Development Guidelines

## Project Identity

- Name the project: `meungmoon`
- Stack: Next.js (App Router, TypeScript), Tailwind CSS, shadcn/ui, Zustand
- Language rules: **UI texts in Korean**, **code comments in Japanese**, commit/messages in Korean allowed

## Directory Rules

- Place reusable UI primitives in `components/ui/`
- Place dashboard-specific UI in `components/dashboard/**`
- Place hooks in `components/**/hooks/` or `utils/` only when generic
- Place templates/organisms under `components/dashboard/templates/`
- Place API routes under `app/api/**`
- Place server-side domain logic under `lib/**`
- Place constants under `constants/**`
- Place Zustand stores under `stores/**`
- Place shared types under `components/**/types/**` or closest domain folder
- Do not create new top-level folders without necessity; prefer existing structure

## Data Flow Rules

- Read external data via `app/api/**` routes only; do not fetch third-party APIs directly from client components
- Implement fetching logic in `lib/**` and import from API route; API route only orchestrates and returns JSON
- Client components/hooks must call internal API routes (`/api/...`) or read via server components where appropriate
- State management: use Zustand stores in `stores/**` for cross-component state; keep local UI state inside hooks

## Google Sheets Ingestion

- For Google Sheets sources, implement a domain function in `lib/<domain>/<source>/fetch*.ts`
- API route in `app/api/<domain>/<source>/route.ts` must call the lib function and return JSON
- Prefer CSV export endpoints to avoid OAuth; sanitize and parse explicitly
- Example sheet mapping (스카니아):
  - Sheet name: "스카니아"
  - Column A starting A3: price (number)
  - Column B starting B3: date (YYYY-MM-DD or parseable)
- Normalize to `PriceData` used by `components/dashboard/types/dashboard.ts`:
  - `date`: ISO string from date cell (assume local midnight if time missing)
  - `price_meso_per_mepo`: 원 단위의 "메포당 가격" 숫자 값 (쉼표 제거 후 Number)

## Coding Standards

- Follow Single Responsibility Principle; split state, compute, and handlers into hooks like `useDashboardControl`
- Name variables and functions descriptively (no abbreviations)
- Avoid deep nesting; use early returns
- Comments: write short Japanese comments above code blocks; do not use inline comments
- Formatting: match existing style; do not reformat unrelated lines
- Tailwind-first styling; avoid heavy UI libs beyond shadcn/ui

## Theme and Color System Standards

- Unify colors via `app/globals.css` CSS variables and Tailwind `@theme` tokens.
- Remove and forbid color constants in `constants/**` (e.g., delete `constants/commonConst.ts`).
- Define palettes:
  - Light: primary `#606c38`, secondary `#283618`, accent `#fefae0`, warning `#dda15e`, highlight `#bc6c25`
  - Dark: primary `#0a0908`, secondary `#22333b`, accent `#eae0d5`, warning `#c6ac8f`, highlight `#5e503f`
- Role mapping (70/25/5 rule):
  - `--color-surface` → background (70%)
  - `--color-content` → main UI/content (25%)
  - `--color-accent` → emphasis (5%)
- Implement tokens in `app/globals.css`:
  - Set light/dark palette variables on `:root` and `.dark`.
  - Map role tokens per mode.
  - Expose tokens inside `@theme` for Tailwind usage.
- Configure Tailwind:
  - Add `tailwind.config.js` with `darkMode: "class"`.
  - Extend `theme.colors.light|dark` with the 5-color palettes.
- Usage rules:
  - Prefer role tokens via classes like `bg-[--color-surface]`, `text-[--color-content]`.
  - For direct palette, use `bg-[var(--light-primary)]` or Tailwind colors `text-light-primary` when appropriate.
  - In TS/JS, avoid importing color codes; read from CSS variables where needed or pass via props.
- Migration rules:
  - Remove imports of `@/constants/commonConst` and `BRAND_COLORS`.
  - Update helpers like `getThemeColors` to use role/palette tokens.
  - Do not add new color constants; update `globals.css` and `tailwind.config.js` instead.

## Coupled File Updates (Must update together)

## Hook and Component Rules

- All client components include `"use client"` when required
- Keep components presentational; move logic into hooks under `components/**/hooks/`
- Hooks must return grouped state, derived values, and handlers in an object

## API Route Rules

- Always export `GET/POST/etc` handlers from `app/api/**/route.ts`
- Do not embed business logic in the route; delegate to `lib/**`
- Return `NextResponse.json(data)`; handle errors with proper status codes

## Store Rules

- Define store types in `stores/**/type.ts`
- Stores expose state and actions; no side effects in selectors
- Update stores only in hooks or server actions; avoid ad-hoc updates in components

## Coupled File Updates (Must update together)

- If `PriceData` changes, update: `components/dashboard/types/dashboard.ts`, `lib/dashboard-utils.ts`, any templates that consume it, and mocks in `constants/mocks/price-data.ts`
- When adding a new API route under `app/api/**`, also add the corresponding `lib/**` function and, if client needs it, a hook or store reader
- When adding a new dashboard template, update its usage in `components/dashboard/pages/**`
- When modifying theme colors:
  - Update `app/globals.css` tokens
  - Update `tailwind.config.js` extended colors
  - Refactor TS/TSX usages away from deleted constants

## Decision Rules

- Adding a new data source:
  1) Create `lib/<domain>/<source>/fetch*.ts`
  2) Wire API route under `app/api/<domain>/<source>/route.ts`
  3) Define/confirm types under `components/**/types/**`
  4) Update consuming hooks to call the API and store results
- UI change touching multiple templates: update template in `components/dashboard/templates/` and adjust props at the page level

## Prohibited

- Direct third-party fetches from client components
- Inline comments or verbose explanatory comments
- Unnecessary folder creation or top-level structure changes
- Pushing binary/large assets into `public/` without necessity

## Validation

- After edits, run lints for changed files only
- Ensure no type errors; adjust types and utils together as specified
  - When sheet shape changes, update utils to use `date` and `price_meso_per_mepo` consistently

## Google Sheets Access Rules

- **Use `googleapis` only from server-side code**. Do not call it in client components.
- **Required env vars** (set in deployment and local `.env`):
  - `GOOGLE_SHEET_ID`
  - `GOOGLE_SHEETS_SERVICE_ACCOUNT_EMAIL`
  - `GOOGLE_SHEETS_PRIVATE_KEY` (PEM, with `\n` escaped in `.env`)
- **Optional (local dev preferred on Windows):**
  - `GOOGLE_SHEETS_KEY_FILE` → absolute/relative path to the service account JSON; if set, it is preferred over inline credentials
- **Windows guidance:** When using PowerShell or `.env`, prefer `GOOGLE_SHEETS_KEY_FILE`. If you must use inline key, ensure newlines are stored as `\n` and normalized in code.
- **Runtime rule:** Any API route that uses `googleapis` must export `export const runtime = 'nodejs'` to avoid Edge/crypto issues.
- **Security:** Never commit the service account JSON. Ensure `.gitignore` excludes it. Do not log secrets.
- **Touchpoints:**
  - Keep Google Sheets auth in `lib/google-sheets.ts` only. Routes import and call it.
  - Do not duplicate auth logic elsewhere.
- **Error handling:** Fail fast with clear messages if envs are missing or invalid.
- **Example test:** `curl http://localhost:3000/api/maplePointPrices/scania` should return JSON array of prices.

## shadcn/ui Rules

- All shadcn components live under `components/ui/shacdn`.
- Keep only used components to reduce bundle and maintenance. If new components are required, add them via CLI:
  - `npx shadcn@latest add <component> --path components/ui/shacdn`
  - Examples: `button`, `badge`, `card`, `toast`, `toggle-group`
  - Batch example: `npx shadcn@latest add dialog drawer sheet tooltip --path components/ui/shacdn`