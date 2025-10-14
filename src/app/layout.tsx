import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GAReporter from "@/components/GAReporter";
import CookieConsent from "@/components/CookieConsent";
import SignupBanner from "@/components/SignupBanner";
import AdPlaceholder from "@/components/AdPlaceholder";
import { SITE } from "@/lib/seo"; // centralised SEO settings
import { SpeedInsights } from "@vercel/speed-insights/next";

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
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
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
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="en">
      <head>
        {gaId && (
          <>
            {/* Consent Mode - must load before gtag */}
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('consent', 'default', {
                    'ad_storage': 'denied',
                    'ad_user_data': 'denied',
                    'ad_personalization': 'denied',
                    'analytics_storage': 'denied',
                    'functionality_storage': 'denied',
                    'security_storage': 'granted'
                  });
                `,
              }}
            />
            {/* Google Analytics */}
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}');
                `,
              }}
            />
          </>
        )}
        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8361515961087484"
          crossOrigin="anonymous"
        />
        {/* JSON-LD: Organization Schema - helps establish brand identity with Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: SITE.name,
              alternateName: "Bite Buddy UK",
              url: SITE.url,
              logo: `${SITE.url}/logo.png`,
              description: "UK copycat recipes from your favourite restaurants and brands. Easy, tested recipes you can make at home.",
              sameAs: [
                SITE.twitter ? `https://twitter.com/${SITE.twitter.replace('@', '')}` : null,
              ].filter(Boolean),
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "Customer Service",
                url: `${SITE.url}/contact`,
              },
            }),
          }}
        />
        {/* JSON-LD: WebSite Schema - enables Google sitelinks search box */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: SITE.name,
              url: SITE.url,
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: `${SITE.url}/search?q={search_term_string}`,
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-gray-900 bg-green-50 pb-20`}
      >
        <GAReporter />
        <CookieConsent />
        <SignupBanner />
        <SpeedInsights />
        <Header />
        {children}
        <div className="mx-auto max-w-6xl px-4 py-6">
          <AdPlaceholder size="leaderboard" />
        </div>
        <Footer />
      </body>
    </html>
  );
}
