# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

"ato de yomu" is a Next.js 15 (App Router) read-later service. Users save web pages, track read/unread state, and optionally expose their list publicly (with RSS) or via a personal access token API.

## Commands

- `docker compose up` — start local PostgreSQL 15 (env vars come from `.env`; copy from `.env.example` first).
- `npm i --legacy-peer-deps` — install. `--legacy-peer-deps` is required (React 19 + `@next-auth/prisma-adapter` peer mismatch); Vercel's `installCommand` also uses it.
- `npm run dev` — Next dev server.
- `npm run build` / `npm start` — production build / serve.
- `npm run lint` — runs `tsc` **then** `next lint`. There is no separate typecheck script; `lint` is the typecheck.
- `npx prisma db seed` — seeds 200 dummy pages under user `alice`.
- `ANALYZE=true npm run build` — bundle analyzer.
- **No test suite** exists; don't invent one.

## Database schema workflow

Schema is defined in `prisma/schema.prisma` but migrations are **not** managed by `prisma migrate`. Instead:

1. Edit `prisma/schema.prisma`.
2. Run `./db/migrate` — this script uses `prisma migrate diff` to regenerate `db/schema.sql`, then applies it to the running local DB via [`psqldef`](https://github.com/sqldef/sqldef) (must be installed — see README). It also runs `prisma generate`.

Production schema application is currently **manual** / disabled in `deploy.sh` (pending sqldef/sqldef#451). Don't assume `deploy.sh` migrates prod.

`postinstall` runs `prisma generate` automatically.

## Architecture

### Auth (NextAuth v4, database sessions)

- Single provider: Google (`src/lib/auth/auth.config.ts`).
- `session.strategy = "database"` — sessions live in the `Session` Prisma table via `PrismaAdapter`.
- The `session` callback **rewrites** the session object from the DB `User` row every request, exposing `id`, `name`, `image`, `private`, `registerCompleted`, `personalAccessToken` on `session.user`. Any new user field you want available to the client must be added here.
- First-login `profile()` derives a unique `name` from the email local-part (suffixing a 6-char cuid on collision / forbidden names like `welcome`) and generates a 40-char hex `personalAccessToken`.
- Server code must use `auth()` from `src/lib/auth/auth.ts` (wraps `getServerSession`). No middleware — pages call `auth()` and `redirectToWelcomePageIfNeeded` themselves.
- Production uses custom cookie names with `__Secure-` / `__Host-` prefixes; dev uses defaults.

### Registration funnel

New users land on `/welcome` (forced by `redirectToWelcomePageIfNeeded` whenever `registerCompleted === false`). The welcome form lets them pick a username before `registerCompleted` is flipped. The funnel check is invoked from both `/` and `/[userName]`.

### Page-saving entrypoints (three, all upsert on `(userId, url)`)

1. **Server Action** — `src/app/[userName]/AddPageFormAction.ts` (form on own page).
2. **`POST /api/pages`** — cookie-authed; accepts `url` / `text` / `title` form fields (used by the PWA Web Share Target; see `public/manifest.json`). Redirects to `/:name?newPageAdded=1` on success.
3. **`POST /api/users/:userName/pages`** — token-authed via `Authorization: Bearer <personalAccessToken>`; JSON body. This is the "API" for Shortcuts/Alfred/extensions.

All three reuse `src/lib/PageInfo.ts`, which manually follows up to 20 redirects carrying cookies (because `fetch`'s auto-redirect drops them, breaking sites that set a cookie mid-redirect), then parses `<title>` / `og:*` / `link[rel=icon]` with `happy-dom`.

Every upsert resets `readAt: null` and bumps `createdAt`, so re-adding a read page returns it to the top of Unread.

### Page listing

- `GET /api/users/:userName/pages?read=0|1&page=N&perPage=M` — paginated via `fetchPages` (`src/app/api/users/[userName]/pages/fetchPages.ts`). Ordered by `readAt desc, createdAt desc`. Respects `user.private` (requires session match). `perPage` is clamped `[1, 100]`.
- `/[userName]/page.tsx` prefetches the first page of both tabs server-side and passes them as `fallbackData` to **`useSWRInfinite`** in `Content.tsx`. Default page size lives in `apiUserPageDefaultPerPage.ts` (shared between server fetch and client key).
- `GET /[userName]/rss?read=0|1` — public RSS (404s if `user.private`). All pages, no pagination.

### Internationalization

- Two locales only: `"ja"` and `"default"` (English).
- Server-side: `await locale()` (`src/lib/i18n/locale.ts`) picks based on `Accept-Language`. **Missing header ⇒ `"ja"`** (intentional: Googlebot sends no `Accept-Language` and we want Japanese indexed).
- Client-side: wrap in `LocaleProvider` and read from `LocaleContext`.
- Translations are a flat object in `src/lib/i18n/strings.ts` keyed by the English string. `i18n(key, locale)` falls back to the key when no translation exists.

### Styling

- **Panda CSS** with the **Park UI** preset. `npm run prepare` runs `panda codegen` to generate `styled-system/`.
- TS aliases: `@/*` → `src/*`, `@styled-system/*` → `styled-system/*`.
- `src/components/park-ui/**` and `src/lib/create-style-context.tsx` are **generated** — excluded from both ESLint and tsconfig. Don't hand-edit. Regenerate via the Park UI CLI if needed.
- Add Park UI components with `npx @park-ui/cli components add <name>`.

### React 19 / Next 15 specifics

- `experimental.reactCompiler: true` is enabled (see `next.config.mjs`). `babel-plugin-react-compiler` is a dep. Don't add manual `useMemo`/`useCallback` unless the compiler can't infer (the `refresh` callback has an eslint-disable because deps involve `mutate` identity).
- `params` and `searchParams` are **Promises** in route handlers and pages — always `await` them.
- Server Actions use `useActionState` on the client; the `timestamp` field in action response types is how client effects detect repeat submissions.
- `serverActions.bodySizeLimit: '5mb'` (raised for profile picture uploads, which go through `/api/users/:name/picture` → Vercel Blob).

### Deployment

- Vercel, region `hnd1`. `buildCommand` is `./deploy.sh` (just `npm run build` currently; the psqldef step is commented out).
- `images.unoptimized: true` — never use `next/image` optimization for external URLs.
- Analytics + Speed Insights from `@vercel/*` are wired into `layout.tsx`.

## Conventions observed in this repo

- Server Actions live next to the component that uses them as `*FormAction.ts`.
- Lint enforces `import/order` with groups `builtin → external → internal → parent → sibling → index` and newlines between groups.
- Unused vars/args starting with `_` are allowed (eslint `unused-imports` + TS rule).
- `prisma` is imported from `@/lib/prisma` — never `new PrismaClient()` elsewhere (it's a singleton guarded against dev hot-reload leaks).
