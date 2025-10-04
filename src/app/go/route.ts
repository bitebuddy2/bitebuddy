import { NextRequest, NextResponse } from "next/server";

// Whitelist of allowed affiliate domains to prevent open-redirect exploits
const ALLOWED_DOMAINS = [
  "amazon.co.uk",
  "www.amazon.co.uk",
  "amzn.to", // Amazon short links
  "tesco.com",
  "www.tesco.com",
  "ocado.com",
  "www.ocado.com",
  "waitrose.com",
  "www.waitrose.com",
  "souschef.co.uk",
  "www.souschef.co.uk",
  "awin.com",
  "www.awin1.com", // Awin tracking domain
];

function isAllowedDomain(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();

    // Check exact match or subdomain match
    return ALLOWED_DOMAINS.some(
      (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get("u");

  // Validate URL is provided
  if (!url) {
    return NextResponse.json(
      { error: "Missing URL parameter" },
      { status: 400 }
    );
  }

  // Validate URL is whitelisted
  if (!isAllowedDomain(url)) {
    return NextResponse.json(
      { error: "Invalid redirect URL" },
      { status: 403 }
    );
  }

  // Use 307 (Temporary Redirect) instead of 301
  // 307 preserves the request method and is temporary
  const response = NextResponse.redirect(url, 307);

  // Set Cache-Control to no-store to ensure click logs fire
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");

  return response;
}
