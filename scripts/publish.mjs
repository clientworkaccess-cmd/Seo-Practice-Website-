// Publish a test post through the live write endpoint, exactly as n8n will.
// Usage:
//   SITE=https://your-site.vercel.app SECRET=your-secret node scripts/publish.mjs
// Optional: TITLE="..." to set a custom title.
const SITE = process.env.SITE || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const SECRET = process.env.SECRET || process.env.REVALIDATE_SECRET;
if (!SECRET) { console.error("Set SECRET (matches REVALIDATE_SECRET)"); process.exit(1); }

const title = process.env.TITLE || `Test post ${new Date().toISOString().slice(0, 16)}`;
const payload = {
  title,
  meta_description: "A post published via the API to test the publish path.",
  body_md: `# ${title}\n\nPublished through the write endpoint at ${new Date().toISOString()}.\n\n## Section\n\nThis is dummy body text. Edit or delete freely.\n`,
  status: "published",
};

const res = await fetch(`${SITE}/api/posts`, {
  method: "POST",
  headers: { "content-type": "application/json", "x-secret": SECRET },
  body: JSON.stringify(payload),
});
const json = await res.json();
console.log(res.status, JSON.stringify(json, null, 2));
if (json.ok) console.log(`\nLive at: ${SITE}/blog/${json.slug}`);
