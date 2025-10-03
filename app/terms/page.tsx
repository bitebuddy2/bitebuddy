export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <p className="text-sm text-gray-600 mb-6">Last updated: October 3, 2025</p>

      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">Agreement to Terms</h2>
          <p>
            By accessing or using BiteBuddy, you agree to be bound by these Terms of Service. If you do not
            agree to these terms, please do not use our service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Description of Service</h2>
          <p>
            BiteBuddy is a recipe discovery and management platform that allows users to browse, search, and
            save recipes. We provide tools to filter recipes based on dietary preferences, ingredients, and
            nutritional information.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">User Accounts</h2>
          <p className="mb-2">When you create an account with us:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>You must provide accurate and complete information</li>
            <li>You are responsible for maintaining the security of your account</li>
            <li>You are responsible for all activities that occur under your account</li>
            <li>You must be at least 13 years old to use BiteBuddy</li>
            <li>You must notify us immediately of any unauthorized use of your account</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Acceptable Use</h2>
          <p className="mb-2">You agree not to:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Use the service for any illegal purpose</li>
            <li>Violate any laws in your jurisdiction</li>
            <li>Infringe on intellectual property rights</li>
            <li>Transmit viruses, malware, or harmful code</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Interfere with or disrupt the service</li>
            <li>Scrape or harvest data from the service without permission</li>
            <li>Impersonate another person or entity</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Content and Recipes</h2>
          <p>
            The recipes and content provided on BiteBuddy are for informational purposes only. We make no
            guarantees about the accuracy, completeness, or reliability of any recipe or nutritional information.
            Always verify ingredients and nutritional information if you have dietary restrictions or allergies.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Intellectual Property</h2>
          <p>
            The BiteBuddy platform, including its design, features, and functionality, is owned by BiteBuddy
            and is protected by copyright, trademark, and other intellectual property laws. Recipes and content
            are the property of their respective creators.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">User-Generated Content</h2>
          <p>
            By saving or sharing recipes on BiteBuddy, you grant us a non-exclusive, worldwide, royalty-free
            license to use, store, and display your saved content solely for the purpose of providing our service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Disclaimer of Warranties</h2>
          <p>
            BiteBuddy is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, either express
            or implied. We do not warrant that:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
            <li>The service will be uninterrupted or error-free</li>
            <li>The results obtained from the service will be accurate or reliable</li>
            <li>Any errors in the service will be corrected</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, BiteBuddy shall not be liable for any indirect, incidental,
            special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred
            directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
            <li>Your use or inability to use the service</li>
            <li>Any unauthorized access to or use of our servers</li>
            <li>Any errors or omissions in any content</li>
            <li>Allergic reactions or health issues from following recipes</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless BiteBuddy from any claims, damages, losses, liabilities,
            and expenses (including legal fees) arising from your use of the service or violation of these terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Termination</h2>
          <p>
            We reserve the right to suspend or terminate your account at any time, with or without notice, for
            any reason, including violation of these terms. You may also delete your account at any time.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Changes to Terms</h2>
          <p>
            We may modify these terms at any time. We will notify you of any changes by posting the new terms
            on this page. Your continued use of the service after such changes constitutes acceptance of the
            new terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Governing Law</h2>
          <p>
            These terms shall be governed by and construed in accordance with applicable laws, without regard
            to conflict of law principles.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Contact Us</h2>
          <p>
            If you have questions about these Terms of Service, please contact us at:{' '}
            <a href="mailto:bitebuddy2@gmail.com" className="text-blue-600 hover:underline">
              bitebuddy2@gmail.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
