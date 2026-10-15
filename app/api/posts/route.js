// Write endpoint for the publish path. n8n (or the test script) POSTs here.
// Protected by a shared secret. Upserts a post by slug, then revalidates.
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { adminClient } from "../../../lib/supabaseAdmin";

function slugify(s) {
  return String(s).toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}

export async function POST(req) {
  const secret = req.headers.get("x-secret");
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "bad json" }, { status: 400 }); }

  const { title, body_md } = body;
  if (!title || !body_md) return NextResponse.json({ error: "title and body_md required" }, { status: 400 });

  const slug = body.slug ? slugify(body.slug) : slugify(title);
  const now = new Date().toISOString();
  const row = {
    slug, title,
    meta_description: body.meta_description || "",
    body_md,
    status: body.status || "published",
    canonical_url: body.canonical_url || null,
    published_at: body.published_at || now,
    updated_at: now,
  };

  let supa;
  try { supa = adminClient(); }
  catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }

  const { data, error } = await supa.from("posts").upsert(row, { onConflict: "slug" }).select().maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidatePath("/");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/sitemap.xml");
  return NextResponse.json({ ok: true, slug, post: data });
}
