// Single source for reading posts. Uses Supabase when configured,
// otherwise falls back to local Markdown files in /content so the site
// renders before any account is connected.
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const usingSupabase = Boolean(url && anon && !url.includes("YOUR-PROJECT"));

function publicClient() {
  return createClient(url, anon, { auth: { persistSession: false } });
}

function localPosts() {
  const dir = path.join(process.cwd(), "content");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(dir, f), "utf8");
      const { data, content } = matter(raw);
      return {
        slug: data.slug || f.replace(/\.md$/, ""),
        title: data.title || "Untitled",
        meta_description: data.meta_description || "",
        body_md: content,
        status: data.status || "published",
        canonical_url: data.canonical_url || null,
        published_at: data.published_at || new Date().toISOString(),
        updated_at: data.updated_at || data.published_at || new Date().toISOString(),
      };
    })
    .filter((p) => p.status === "published")
    .sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
}

export async function getAllPosts() {
  if (!usingSupabase) return localPosts();
  const { data, error } = await publicClient()
    .from("posts").select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (error) { console.error("Supabase read failed, using local:", error.message); return localPosts(); }
  return data || [];
}

export async function getPostBySlug(slug) {
  if (!usingSupabase) return localPosts().find((p) => p.slug === slug) || null;
  const { data, error } = await publicClient()
    .from("posts").select("*")
    .eq("slug", slug).eq("status", "published").maybeSingle();
  if (error) { console.error("Supabase read failed, using local:", error.message); return localPosts().find((p) => p.slug === slug) || null; }
  return data;
}
