---
slug: welcome
title: Welcome to the testbed
meta_description: This post is served from a local Markdown file, before Supabase is connected.
status: published
published_at: 2026-10-10T09:00:00.000Z
---

This post lives in `/content/welcome.md`. It renders **without any database**, so you can run the site locally the moment you install dependencies.

## Why a local fallback

So you can see the layout, routing, sitemap and schema working before touching Supabase or Vercel. Once Supabase is connected, published rows there take over and these files are ignored.

## Next step

Connect Supabase, run `schema.sql`, then publish a post with `npm run publish:test`.
