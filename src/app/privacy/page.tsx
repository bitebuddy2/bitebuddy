import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "BiteBuddy privacy policy and GDPR compliance information.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-4xl font-bold tracking-tight mb-4">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">
        Effective Date: 6 October 2025 | Last Updated: {new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>

      <div className="prose prose-emerald max-w-none space-y-8">
        {/* Introduction */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p className="text-gray-700 leading-relaxed">
            Welcome to BiteBuddy ("we", "our", or "us"). We are committed to protecting your privacy and complying with the
            General Data Protection Regulation (GDPR) and other applicable data protection laws. This Privacy Policy explains
            how we collect, use, and protect your personal information when you use our website.
          </p>
          <p className="text-gray-700 leading-relaxed mt-4">
            By using BiteBuddy, you agree to the collection and use of information in accordance with this policy.
          </p>
        </section>

        {/* Data Controller */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">2. Data Controller</h2>
          <p className="text-gray-700 leading-relaxed">
            The data controller responsible for your personal data is BiteBuddy.
          </p>
        </section>

        {/* Information We Collect */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Information We Collect</h2>

          <h3 className="text-xl font-semibold mb-3 mt-6">3.1 Information You Provide</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            When you use certain features of our website, you may provide us with:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Email address (for account registration and newsletter subscriptions)</li>
            <li>Account information (username, preferences)</li>
            <li>Recipes you save or create using our AI generator</li>
            <li>Any other information you choose to provide</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">3.2 Automatically Collected Information</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            When you visit our website, we may automatically collect:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Device information (type, operating system, browser type)</li>
            <li>Usage data (pages visited, time spent, navigation patterns)</li>
            <li>IP address (anonymized for EU users)</li>
            <li>Cookie data (see Cookie Policy section below)</li>
          </ul>
        </section>

        {/* Cookies and Tracking */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Cookies and Tracking Technologies</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We use cookies and similar tracking technologies to improve your experience and understand how our website is used.
          </p>

          <h3 className="text-xl font-semibold mb-3 mt-6">4.1 Types of Cookies We Use</h3>

          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h4 className="font-semibold text-gray-900 mb-2">Essential Cookies (Always Active)</h4>
            <p className="text-gray-700 text-sm">
              These cookies are necessary for the website to function properly. They enable core functionality such as
              security, authentication, and accessibility. These cookies do not require consent.
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h4 className="font-semibold text-gray-900 mb-2">Analytics Cookies (Google Analytics)</h4>
            <p className="text-gray-700 text-sm mb-2">
              We use Google Analytics to understand how visitors interact with our website. These cookies help us:
            </p>
            <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
              <li>Understand which pages are most popular</li>
              <li>Identify and fix technical issues</li>
              <li>Improve our content and user experience</li>
              <li>Measure the effectiveness of our features</li>
            </ul>
            <p className="text-gray-700 text-sm mt-2">
              IP addresses are anonymized when consent is not granted. These cookies require your consent.
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h4 className="font-semibold text-gray-900 mb-2">Advertising Cookies (Google AdSense)</h4>
            <p className="text-gray-700 text-sm mb-2">
              We use Google AdSense to display advertisements on our website. These cookies:
            </p>
            <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
              <li>Help show you relevant advertisements</li>
              <li>Measure ad performance and effectiveness</li>
              <li>Prevent the same ad from being shown too many times</li>
              <li>Understand how users interact with ads</li>
            </ul>
            <p className="text-gray-700 text-sm mt-2">
              If you decline advertising cookies, you may still see ads, but they will be non-personalized.
              These cookies require your consent.
            </p>
          </div>

          <h3 className="text-xl font-semibold mb-3 mt-6">4.2 Managing Your Cookie Preferences</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            When you first visit our website, you'll see a cookie consent banner with two options:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li><strong>Accept All:</strong> Allows all cookies including analytics and advertising</li>
            <li><strong>Essential Only:</strong> Only allows necessary cookies for site functionality</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-4">
            You can change your cookie preferences at any time by clearing your browser's site data and revisiting our website.
          </p>
        </section>

        {/* Third-Party Services */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Third-Party Services</h2>

          <h3 className="text-xl font-semibold mb-3 mt-6">5.1 Google Analytics</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            We use Google Analytics to analyze website usage. Google Analytics uses cookies to collect information about
            how visitors use our site. This information is aggregated and anonymous. Google may use this data in accordance
            with their Privacy Policy.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Learn more: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">Google Privacy Policy</a>
          </p>

          <h3 className="text-xl font-semibold mb-3 mt-6">5.2 Google AdSense</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            We use Google AdSense to display advertisements on our website. Google may use cookies and similar technologies to:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li>Personalize ads based on your interests (if you consent)</li>
            <li>Measure ad performance and effectiveness</li>
            <li>Show you relevant advertisements</li>
            <li>Prevent fraud and abuse</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-4">
            Google is a data controller for any personal data collected through their services. They process data in accordance
            with their own privacy policy.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Learn more: <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">How Google uses data when you use our partners' sites or apps</a>
          </p>

          <h3 className="text-xl font-semibold mb-3 mt-6">5.3 Affiliate Links</h3>
          <p className="text-gray-700 leading-relaxed">
            We may include affiliate links to retailers (such as Tesco, Asda, Sainsbury's) where you can purchase ingredients.
            When you click these links and make a purchase, we may earn a commission at no extra cost to you. We track these
            clicks anonymously to measure effectiveness.
          </p>
        </section>

        {/* How We Use Your Data */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">6. How We Use Your Information</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We use the information we collect for the following purposes:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>To provide and maintain our website and services</li>
            <li>To improve and personalize your experience</li>
            <li>To send you newsletters and updates (if you've subscribed)</li>
            <li>To analyze website usage and trends</li>
            <li>To detect, prevent, and address technical issues</li>
            <li>To display relevant advertisements (if you consent)</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        {/* Legal Basis */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Legal Basis for Processing (GDPR)</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Under GDPR, we process your personal data based on the following legal grounds:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li><strong>Consent:</strong> For analytics and advertising cookies (you can withdraw consent at any time)</li>
            <li><strong>Legitimate Interests:</strong> For essential cookies, security, and fraud prevention</li>
            <li><strong>Contract:</strong> To provide services you've requested (e.g., account features)</li>
            <li><strong>Legal Obligation:</strong> To comply with applicable laws and regulations</li>
          </ul>
        </section>

        {/* Data Sharing */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">8. Data Sharing and Disclosure</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We do not sell your personal information. We may share your information with:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li><strong>Service Providers:</strong> Google (Analytics, AdSense), Supabase (database), Vercel (hosting)</li>
            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
            <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-4">
            All service providers are required to maintain appropriate security measures and only process your data according to our instructions.
          </p>
        </section>

        {/* Data Retention */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">9. Data Retention</h2>
          <p className="text-gray-700 leading-relaxed">
            We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy.
            Analytics data is typically retained for 26 months. Account data is retained until you request deletion. You can request
            deletion of your data at any time by contacting us.
          </p>
        </section>

        {/* Your Rights */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">10. Your Rights Under GDPR</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            If you are in the European Economic Area (EEA) or UK, you have the following rights:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li><strong>Right to Access:</strong> Request a copy of your personal data</li>
            <li><strong>Right to Rectification:</strong> Request correction of inaccurate data</li>
            <li><strong>Right to Erasure:</strong> Request deletion of your personal data</li>
            <li><strong>Right to Restrict Processing:</strong> Request limitation of how we use your data</li>
            <li><strong>Right to Data Portability:</strong> Receive your data in a structured format</li>
            <li><strong>Right to Object:</strong> Object to processing based on legitimate interests</li>
            <li><strong>Right to Withdraw Consent:</strong> Withdraw consent for analytics/advertising at any time</li>
            <li><strong>Right to Lodge a Complaint:</strong> File a complaint with your local data protection authority</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-4">
            To exercise any of these rights, please contact us using the details below.
          </p>
        </section>

        {/* Security */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">11. Data Security</h2>
          <p className="text-gray-700 leading-relaxed">
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized
            access, alteration, disclosure, or destruction. However, no internet transmission is completely secure, and we cannot
            guarantee absolute security.
          </p>
        </section>

        {/* International Transfers */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">12. International Data Transfers</h2>
          <p className="text-gray-700 leading-relaxed">
            Your information may be transferred to and processed in countries outside the EEA/UK. When we transfer data internationally,
            we ensure appropriate safeguards are in place, such as Standard Contractual Clauses approved by the European Commission.
          </p>
        </section>

        {/* Children's Privacy */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">13. Children's Privacy</h2>
          <p className="text-gray-700 leading-relaxed">
            Our website is not intended for children under 16. We do not knowingly collect personal information from children.
            If you believe we have collected information from a child, please contact us immediately.
          </p>
        </section>

        {/* Changes to Policy */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">14. Changes to This Privacy Policy</h2>
          <p className="text-gray-700 leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy
            on this page and updating the "Last Updated" date. Significant changes will be prominently announced on our website.
          </p>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">15. Contact Us</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700"><strong>Email:</strong> privacy@bitebuddy.uk</p>
            <p className="text-gray-700 mt-2"><strong>Website:</strong> <a href="https://bitebuddy.uk" className="text-emerald-600 hover:underline">https://bitebuddy.uk</a></p>
          </div>
          <p className="text-gray-700 leading-relaxed mt-4">
            We aim to respond to all requests within 30 days.
          </p>
        </section>

        {/* Additional Resources */}
        <section className="border-t pt-8 mt-8">
          <h2 className="text-2xl font-semibold mb-4">Additional Resources</h2>
          <ul className="space-y-2 text-gray-700">
            <li>
              <a href="https://ico.org.uk/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                UK Information Commissioner's Office (ICO)
              </a>
            </li>
            <li>
              <a href="https://edpb.europa.eu/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                European Data Protection Board
              </a>
            </li>
            <li>
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                Google Privacy Policy
              </a>
            </li>
            <li>
              <a href="https://support.google.com/adsense/answer/13554116" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                Google AdSense EU User Consent Policy
              </a>
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
