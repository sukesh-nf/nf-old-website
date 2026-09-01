# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Writing conventions

- **Never use em-dashes (—) anywhere in the codebase** — not in JSX, string literals, comments, or any other context. Use a comma, colon, hyphen, or rewrite the sentence instead.

## Commands

```bash
npm run dev          # Start Vite dev server
npm run build        # Production build
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit (no emit, just type errors)
npm run preview      # Preview production build locally
```

No test framework is configured.

## Architecture

### What this is
A marketing and sales funnel for **NexFrontier**, an enterprise AI operational reliability platform. It collects beta applications, investor brief requests, and showcases thought leadership content.

### Routing
Hash-based SPA with no router library. `App.tsx` reads `window.location.hash` and maps paths to components:
- Empty hash → `HomePage` (single scrolling page with many sections)
- `#/case-example`, `#/reading-the-shift`, `#/data-readiness-index`, `#/agentic-ai-cx-frontline`, `#/exemplar-videos` → dedicated sub-page components
- `#/blog/:slug` → `BlogPost` with slug lookup
- `#/admin-upload` → internal admin tool

Anchor links like `#beta-programme` trigger smooth-scroll within the home page. Scroll position on the home page is saved to `sessionStorage` before navigating to a sub-page and restored on return.

### State
React hooks only (`useState`, `useRef`). No global store. The only cross-component state is `blogTab` (active blog category tab) which lives in `App` and is passed down.

### Database (Supabase)
Client initialized in `src/lib/supabase.ts` using `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

Tables:
- `form_submissions` — beta applications and QL report email captures; anon INSERT only (no SELECT via RLS)
- `investor_brief_requests` — investor brief signups; same RLS pattern

Storage buckets:
- `reports` — PDF reports uploaded by admin
- `exemplar-videos` — demo video uploads

All tables use RLS. Anonymous users can INSERT but never SELECT their own or others' rows.

### Edge Functions
One function: `supabase/functions/send-application/index.ts`  
Triggered by `ApplicationForm.tsx` on form submit. Inserts into `form_submissions` and sends an email via Resend API (`RESEND_API_KEY` secret). Called with `Authorization: Bearer <anon_key>` and `Apikey: <anon_key>` headers.

### Blog
All blog posts are **hardcoded** as a `Record<slug, BlogMeta>` in `BlogPost.tsx`. No CMS or database. Posts are categorized as Global, Malaysia, or New Zealand.

### SEO
Two custom hooks in `src/lib/`:
- `useMeta` — imperatively updates `<title>`, `<meta name="description">`, and all OG/Twitter tags on mount; restores home defaults on unmount
- `useJsonLd` — injects/replaces a single `<script type="application/ld+json">` tag; removes it on unmount

The base `Organization` + `WebSite` JSON-LD is static in `index.html`. Per-page schemas are added dynamically by each sub-page component calling `useJsonLd`.

### Styling
Tailwind CSS v3 with a custom theme. Key custom tokens in `tailwind.config.js`:
- Colors: `nex-dark`, `nex-darker`, `nex-navy` (backgrounds), `nex-cyan`, `nex-blue` (accents), `nex-text`, `nex-grey`
- Animations: `fade-in`, `float`, `pulse-glow`
- Shadows: `glow-cyan`, `glow-cyan-lg`
- Fonts: Urbanist (headings, `font-urbanist`), Inter (body, `font-inter`)

Framer Motion is used throughout for entrance animations and tab/carousel transitions.

### Migrations
Supabase migrations live in `supabase/migrations/`. Always use `mcp__supabase__apply_migration` to apply DDL changes — never raw SQL execution for schema changes.
