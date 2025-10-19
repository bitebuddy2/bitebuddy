import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - Recipe Requests & Support | Bite Buddy",
  description: "Get in touch with Bite Buddy for recipe requests, questions, feedback, or partnership opportunities. We typically respond within 24-48 hours.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Us - Recipe Requests & Support | Bite Buddy",
    description: "Get in touch with Bite Buddy for recipe requests, questions, feedback, or partnership opportunities. We typically respond within 24-48 hours.",
  },
  twitter: {
    title: "Contact Us - Recipe Requests & Support | Bite Buddy",
    description: "Get in touch with Bite Buddy for recipe requests, questions, feedback, or partnership opportunities. We typically respond within 24-48 hours.",
  },
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-4xl font-bold tracking-tight mb-8">Contact Us</h1>

      <div className="prose prose-emerald max-w-none space-y-8">
        <section>
          <p className="text-gray-700 leading-relaxed text-lg">
            We'd love to hear from you! Whether you have a recipe request, found an issue,
            or just want to share your cooking success, get in touch.
          </p>
        </section>

        <section className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">📧 Email</h3>
              <p className="text-gray-700">
                <a
                  href="mailto:bitebuddy2@gmail.com"
                  className="text-emerald-600 hover:underline text-lg"
                >
                  bitebuddy2@gmail.com
                </a>
              </p>
              <p className="text-sm text-gray-600 mt-1">
                We typically respond within 24-48 hours
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">📱 Social Media</h3>
              <p className="text-gray-700">
                Follow us for recipe updates and cooking tips:
              </p>
              <p className="text-gray-700 mt-1">
                Twitter/X: <a href="https://twitter.com/bitebuddy" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">@bitebuddy</a>
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">What You Can Contact Us About</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">🍽️ Recipe Requests</h3>
              <p className="text-sm text-gray-700">
                Want us to recreate a specific dish? Let us know which restaurant or bakery item you'd like to make at home.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">🐛 Report Issues</h3>
              <p className="text-sm text-gray-700">
                Found a bug, broken link, or recipe that didn't work? Tell us so we can fix it.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">💡 Suggestions</h3>
              <p className="text-sm text-gray-700">
                Have ideas to improve BiteBuddy? We're always open to feedback and feature requests.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">🤝 Partnerships</h3>
              <p className="text-sm text-gray-700">
                Interested in collaborating or working with us? Drop us an email.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900">Can I submit my own recipe?</h3>
              <p className="text-gray-700 text-sm mt-1">
                Currently we create all recipes in-house to ensure quality and accuracy. However, if you have
                suggestions or tips for improving existing recipes, we'd love to hear them!
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">How long does it take to add a requested recipe?</h3>
              <p className="text-gray-700 text-sm mt-1">
                We test each recipe multiple times before publishing. Typical turnaround is 1-2 weeks, but
                complex recipes may take longer.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">Are you affiliated with the brands you feature?</h3>
              <p className="text-gray-700 text-sm mt-1">
                No, BiteBuddy is independently run. We're not affiliated with or endorsed by any restaurant
                chains. We simply create copycat recipes as a resource for home cooks.
              </p>
            </div>
          </div>
        </section>

        <section className="border-t pt-6">
          <h2 className="text-2xl font-semibold mb-4">Other Ways to Connect</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>
              <a href="/privacy" className="text-emerald-600 hover:underline">Privacy Policy</a> -
              Learn how we handle your data
            </li>
            <li>
              <a href="/terms" className="text-emerald-600 hover:underline">Terms of Service</a> -
              Review our terms and conditions
            </li>
            <li>
              <a href="/premium" className="text-emerald-600 hover:underline">Premium Membership</a> -
              Unlock additional features
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
