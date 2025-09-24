import { NextResponse } from "next/server";
import { SITE } from "@/lib/seo";

export async function GET() {
  const body = `
User-agent: *
Allow: /

Sitemap: ${SITE.url}/sitemap.xml
  `.trim();

  return new NextResponse(body, {
    headers: { "content-type": "text/plain" },
  });
}
