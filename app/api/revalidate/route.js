// Manual revalidation hook for n8n after a direct DB change.
// POST { "path": "/blog/some-slug" } with header x-secret.
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req) {
  const secret = req.headers.get("x-secret");
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  let body = {};
  try { body = await req.json(); } catch {}
  const path = body.path || "/";
  revalidatePath(path);
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  return NextResponse.json({ ok: true, revalidated: path });
}
