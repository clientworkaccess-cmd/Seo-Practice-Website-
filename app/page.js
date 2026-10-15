import { getAllPosts, usingSupabase } from "../lib/posts";

export const dynamic = "force-dynamic";

export default async function Home() {
  const posts = await getAllPosts();
  return (
    <main>
      <p style={{ color: "var(--muted)", fontSize: 13, marginTop: -8 }}>
        Source: {usingSupabase ? "Supabase" : "local Markdown fallback"} — {posts.length} published post(s)
      </p>
      <ul className="post-list">
        {posts.map((p) => (
          <li key={p.slug}>
            <h2><a href={`/blog/${p.slug}`}>{p.title}</a></h2>
            <span className="date">{new Date(p.published_at).toLocaleDateString()}</span>
            {p.meta_description && <p>{p.meta_description}</p>}
          </li>
        ))}
        {posts.length === 0 && <li>No posts yet. Publish one with <code>npm run publish:test</code>.</li>}
      </ul>
    </main>
  );
}
