import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EU Privacy Policy",
  description: "BiteBuddy EU privacy policy and GDPR compliance information.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-4xl font-bold tracking-tight mb-8">EU Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">GDPR Compliant</p>

      <div className="prose prose-emerald max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Analytics & Cookies</h2>
          <p className="text-gray-700 leading-relaxed">
            We use Google Analytics to help us understand site usage. Analytics is disabled by default
            and only enabled if you choose "Accept analytics" in the cookie banner. Consent can be
            changed by clearing your browser's site data. Google Analytics may set cookies when enabled;
            IP addresses are anonymized via Google's Consent Mode. No personal data is collected unless
            you explicitly provide it (e.g., newsletter signup).
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Data We Collect</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            When you use BiteBuddy, we may collect:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Page views and navigation patterns (only if analytics is enabled)</li>
            <li>Device type, browser, and screen size for improving user experience</li>
            <li>Email address if you subscribe to our newsletter (optional)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">How We Use Your Data</h2>
          <p className="text-gray-700 leading-relaxed">
            We use collected data to improve our recipes, understand which content is most helpful,
            and enhance the overall user experience. We never sell or share your personal information
            with third parties for marketing purposes.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
          <p className="text-gray-700 leading-relaxed">
            You have the right to access, correct, or delete any personal data we hold about you.
            To exercise these rights or ask questions about our privacy practices, please contact us.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
          <p className="text-gray-700 leading-relaxed">
            We may update this privacy policy from time to time. Any changes will be posted on this page
            with an updated revision date.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Last updated: {new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </section>
      </div>
    </main>
  );
}
