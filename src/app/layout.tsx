import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE } from "@/lib/seo"; // centralised SEO settings

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.slogan}`,
    template: `%s — ${SITE.name}`,
  },
  description: "Recreate your favourite UK restaurant & bakery dishes at home.",
  alternates: { canonical: "/" },
  openGraph: {
    siteName: SITE.name,
    type: "website",
    url: SITE.url,
    title: `${SITE.name} — ${SITE.slogan}`,
    description: "Recreate your favourite UK restaurant & bakery dishes at home.",
    images: ["/og.jpg"],               // ✅ default OG image
  },
  twitter: {
    card: "summary_large_image",
    site: SITE.twitter,
    images: ["/og.jpg"],               // ✅ default Twitter image
  },
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

  return (
    <html lang="en">
      <head>
        {plausibleDomain && (
          <script
            defer
            data-domain={plausibleDomain}
            src="https://plausible.io/js/script.js"
          />
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-gray-900 bg-white`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
