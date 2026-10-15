import { getAllPosts, getPostBySlug } from "../../../lib/posts";
import { renderMarkdown } from "../../../lib/markdown";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function generateMetadata({ params }) {
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: "Not found" };
  const canonical = post.canonical_url || `${SITE}/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.meta_description || "",
    alternates: { canonical },
    openGraph: { title: post.title, description: post.meta_description || "", url: canonical, type: "article" },
  };
}

export default async function PostPage({ params }) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();
  const html = renderMarkdown(post.body_md);
  const canonical = post.canonical_url || `${SITE}/blog/${post.slug}`;
  const jsonLd = {
    "@context": "https://schema.org", "@type": "Article",
    headline: post.title, description: post.meta_description || "",
    datePublished: post.published_at, dateModified: post.updated_at || post.published_at,
    mainEntityOfPage: canonical,
  };
  return (
    <main>
      <a className="back" href="/">← all posts</a>
      <article>
        <h1>{post.title}</h1>
        <div className="meta">
          Published {new Date(post.published_at).toLocaleDateString()}
          {post.updated_at && post.updated_at !== post.published_at &&
            ` · updated ${new Date(post.updated_at).toLocaleDateString()}`}
        </div>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </article>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  );
}
