-- Run in Supabase SQL editor (Project > SQL Editor > New query).
-- Minimal posts table for the content-loop prototype.

create table if not exists public.posts (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  title           text not null,
  meta_description text default '',
  body_md         text not null,
  status          text not null default 'published',  -- draft | published | retired
  canonical_url   text,
  published_at    timestamptz default now(),
  updated_at      timestamptz default now(),
  -- loop fields (used later by the review/change workflows)
  review_at       timestamptz,
  revision_count  int default 0,
  last_metrics    jsonb default '{}'::jsonb
);

create index if not exists posts_status_pub_idx on public.posts (status, published_at desc);

-- Row Level Security: the public (anon) key may READ published posts only.
-- All writes go through the service role key, which bypasses RLS and is used
-- server-side only (API route + n8n). Never ship the service role key to the browser.
alter table public.posts enable row level security;

drop policy if exists "public reads published" on public.posts;
create policy "public reads published"
  on public.posts for select
  to anon
  using (status = 'published');
