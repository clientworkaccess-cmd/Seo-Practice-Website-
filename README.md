# SEO Loop Testbed

A throwaway Next.js blog for prototyping the automated SEO content loop.
Posts live in **Supabase**; publishing is a DB write + a revalidate call — no
code changes, no redeploy. Falls back to local Markdown so it runs before any
account is connected.

## What's here

- `/blog` + `/blog/[slug]` — list and post pages (canonical, meta, Article JSON-LD)
- `/api/posts` — write endpoint (service-role, secret-protected) = the publish path
- `/api/revalidate` — refresh a page after a direct DB change
- `/sitemap.xml`, `/robots.txt` — dynamic, NOINDEX flag on by default
- `supabase/schema.sql` + `supabase/seed.sql`
- `scripts/publish.mjs` — publish a test post the way n8n will

## 1. Run locally (no accounts needed)

```bash
npm install
cp .env.example .env.local   # defaults are fine for local
npm run dev                  # http://localhost:3000
```

It serves the Markdown in `/content` until Supabase is connected.

## 2. Connect Supabase

1. Create a project at supabase.com.
2. SQL Editor → run `supabase/schema.sql` (and `seed.sql` for dummy rows).
3. Settings → API → copy the Project URL, the `anon` key, and the `service_role` key.
4. Put them in `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server only — never commit, never expose)
   - `REVALIDATE_SECRET` = a long random string

## 3. Deploy to Vercel

1. Push this folder to a new GitHub repo.
2. Import it at vercel.com → New Project.
3. Add the same env vars in Vercel → Settings → Environment Variables.
4. Set `NEXT_PUBLIC_SITE_URL` to the deployed URL.
5. Keep `NEXT_PUBLIC_NOINDEX=1` while testing.

## 4. Test the publish path

```bash
SITE=https://your-site.vercel.app SECRET=your-secret npm run publish:test
```

Prints the created slug and live URL. This is exactly what n8n's HTTP node will
POST to `/api/posts`.

## 5. Wire n8n (next)

- **Publish:** HTTP POST → `/api/posts`, header `x-secret: <REVALIDATE_SECRET>`,
  body `{ title, body_md, meta_description, slug? }`.
- **Edit in place:** same call with an existing `slug` (it upserts).
- **Revalidate after a direct DB change:** POST `/api/revalidate` with `{ "path": "/blog/<slug>" }`.

## Going live for the measurement phase

Set `NEXT_PUBLIC_NOINDEX=0`, verify the site in Search Console (Domain property),
add the service account, and let posts get indexed before the review workflow runs.

## Notes

- Only the `anon` key is public, and RLS limits it to reading published posts.
- The `service_role` key lives in Vercel env + n8n only.
- `status`: `draft` (hidden) | `published` (live) | `retired`.
- Editing a post = upsert by `slug`; the loop's version history table comes later.
