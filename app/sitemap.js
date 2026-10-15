import { getAllPosts } from "../lib/posts";
const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export const dynamic = "force-dynamic";
export default async function sitemap() {
  const posts = await getAllPosts();
  const postUrls = posts.map((p) => ({
    url: `${SITE}/blog/${p.slug}`,
    lastModified: p.updated_at || p.published_at,
  }));
  return [{ url: SITE, lastModified: new Date().toISOString() }, ...postUrls];
}
