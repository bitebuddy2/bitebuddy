import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Bite Buddy",
  description: "Read the Terms of Service for using Bite Buddy, including usage license, user conduct, and subscription terms.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-4xl font-bold tracking-tight mb-8">Terms of Service</h1>

      <div className="prose prose-gray max-w-none">
        <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          By accessing and using BiteBuddy ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Use License</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Permission is granted to temporarily download one copy of the materials (recipes, content) on BiteBuddy for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
        </p>
        <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
          <li>Modify or copy the materials</li>
          <li>Use the materials for any commercial purpose or for any public display</li>
          <li>Attempt to decompile or reverse engineer any software contained on BiteBuddy</li>
          <li>Remove any copyright or other proprietary notations from the materials</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Recipe Accuracy</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          While we strive to provide accurate copycat recipes, BiteBuddy makes no warranties or guarantees about the accuracy, reliability, or completeness of the recipes provided. Recipes are provided "as is" and cooking results may vary.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Premium Subscription</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Premium subscriptions provide access to additional features including unlimited AI recipe generation and extended meal planning. Subscriptions are billed monthly or annually and will automatically renew unless cancelled. You may cancel your subscription at any time through your account settings.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. User Conduct</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          You agree not to use the Service to:
        </p>
        <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
          <li>Violate any applicable laws or regulations</li>
          <li>Infringe upon the rights of others</li>
          <li>Distribute spam or malicious content</li>
          <li>Attempt to gain unauthorized access to any portion of the Service</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Intellectual Property</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          All content on BiteBuddy, including recipes, text, graphics, logos, and images, is the property of BiteBuddy or its content suppliers and is protected by UK and international copyright laws.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Limitation of Liability</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          In no event shall BiteBuddy be liable for any damages (including, without limitation, damages for loss of data or profit) arising out of the use or inability to use the materials on BiteBuddy, even if BiteBuddy has been notified of the possibility of such damage.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">8. Changes to Terms</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          BiteBuddy reserves the right to revise these terms of service at any time without notice. By using this Service, you are agreeing to be bound by the then current version of these terms of service.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">9. Contact Information</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          If you have any questions about these Terms of Service, please contact us:
        </p>
        <div className="bg-gray-50 p-4 rounded-lg space-y-2 mb-4">
          <p className="text-gray-700">
            <strong>General Inquiries:</strong>{" "}
            <a href="mailto:hello@bitebuddy.co.uk" className="text-emerald-600 hover:underline">
              hello@bitebuddy.co.uk
            </a>
          </p>
          <p className="text-gray-700">
            <strong>Support:</strong>{" "}
            <a href="mailto:support@bitebuddy.co.uk" className="text-emerald-600 hover:underline">
              support@bitebuddy.co.uk
            </a>
          </p>
          <p className="text-gray-700">
            <strong>Billing:</strong>{" "}
            <a href="mailto:billing@bitebuddy.co.uk" className="text-emerald-600 hover:underline">
              billing@bitebuddy.co.uk
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
