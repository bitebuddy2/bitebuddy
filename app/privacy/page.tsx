export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-sm text-gray-600 mb-6">Last updated: October 3, 2025</p>

      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">Introduction</h2>
          <p>
            Welcome to BiteBuddy. We respect your privacy and are committed to protecting your personal data.
            This privacy policy will inform you about how we handle your personal data when you use our service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Information We Collect</h2>
          <p className="mb-2">When you use BiteBuddy, we may collect the following information:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li><strong>Account Information:</strong> Name, email address, and profile picture from your Google account</li>
            <li><strong>Usage Data:</strong> Recipes you save, search queries, and app preferences</li>
            <li><strong>Technical Data:</strong> IP address, browser type, and device information</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">How We Use Your Information</h2>
          <p className="mb-2">We use your information to:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Provide and maintain our service</li>
            <li>Authenticate your account and save your recipes</li>
            <li>Improve and personalize your experience</li>
            <li>Send you updates about your saved recipes (if you opt-in)</li>
            <li>Respond to your requests and support needs</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Data Sharing and Disclosure</h2>
          <p>
            We do not sell, trade, or rent your personal information to third parties. We may share your data only in the following circumstances:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
            <li><strong>Service Providers:</strong> We use Supabase for authentication and data storage</li>
            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
            <li><strong>With Your Consent:</strong> When you explicitly agree to share your information</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information. However, no method
            of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Your Rights</h2>
          <p className="mb-2">You have the right to:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Export your data</li>
            <li>Withdraw consent at any time</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Cookies</h2>
          <p>
            We use essential cookies to maintain your session and authentication. We do not use tracking
            or advertising cookies.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Third-Party Services</h2>
          <p className="mb-2">BiteBuddy uses the following third-party services:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li><strong>Google OAuth:</strong> For authentication (subject to Google&apos;s Privacy Policy)</li>
            <li><strong>Supabase:</strong> For data storage and authentication</li>
            <li><strong>Sanity:</strong> For recipe content management</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Children&apos;s Privacy</h2>
          <p>
            BiteBuddy is not intended for children under 13. We do not knowingly collect personal information
            from children under 13. If you believe we have collected such information, please contact us.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify you of any changes by posting
            the new policy on this page and updating the &quot;Last updated&quot; date.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Contact Us</h2>
          <p>
            If you have questions about this privacy policy or want to exercise your rights, please contact us at:{' '}
            <a href="mailto:bitebuddy2@gmail.com" className="text-blue-600 hover:underline">
              bitebuddy2@gmail.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
