const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const NOINDEX = process.env.NEXT_PUBLIC_NOINDEX !== "0";
export default function robots() {
  if (NOINDEX) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return { rules: [{ userAgent: "*", allow: "/" }], sitemap: `${SITE}/sitemap.xml` };
}
