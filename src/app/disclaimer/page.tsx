import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Disclaimer & Disclosures | Bite Buddy",
  description: "Important disclaimers and disclosures about BiteBuddy's affiliate relationships, advertising, and recipe accuracy.",
  alternates: {
    canonical: "/disclaimer",
  },
};

export default function DisclaimerPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-4xl font-bold tracking-tight mb-4">Disclaimer & Disclosures</h1>
      <p className="text-sm text-gray-500 mb-8">
        Last Updated: {new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>

      <div className="prose prose-emerald max-w-none space-y-8">

        {/* Affiliate Disclosure */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Affiliate Relationship Disclosure</h2>

          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4">
            <p className="text-amber-900 font-semibold mb-2">
              ⚠️ Important: BiteBuddy participates in affiliate programs and earns commissions from qualifying purchases.
            </p>
            <p className="text-amber-800 text-sm">
              This means we may earn a small commission when you click certain links and make a purchase, at no extra cost to you.
            </p>
          </div>

          <h3 className="text-xl font-semibold mb-3 mt-6">1.1 What This Means</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            BiteBuddy contains affiliate links to retailers and partners. When you click these links and make a purchase,
            we may earn a commission. <strong>This comes at no additional cost to you</strong> — you pay the same price
            whether you use our link or go directly to the retailer.
          </p>

          <h3 className="text-xl font-semibold mb-3 mt-6">1.2 Affiliate Programs We Participate In</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            We participate in affiliate programs with the following retailers and services:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li><strong>Amazon Associates:</strong> Links to ingredients, kitchen equipment, and cookbooks on Amazon.co.uk</li>
            <li><strong>UK Supermarkets:</strong> Tesco, Asda, Sainsbury's, Ocado, and other UK grocery retailers</li>
            <li><strong>Kitchen Equipment Retailers:</strong> Links to cooking tools, appliances, and bakeware</li>
            <li><strong>Other Partners:</strong> Occasional links to cooking courses, meal kits, or food-related services</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">1.3 Our Editorial Independence</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            While we earn commissions from affiliate links, <strong>this does not influence our recipe development
            or recommendations</strong>. We only recommend products and ingredients we genuinely believe will help
            you recreate restaurant-quality dishes at home.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Our recipes are created based on taste testing, ingredient availability in the UK, and what works best
            in a home kitchen — not based on affiliate commission rates.
          </p>
        </section>

        {/* Advertising Disclosure */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">2. Advertising Disclosure (Google AdSense)</h2>

          <h3 className="text-xl font-semibold mb-3 mt-6">2.1 Display Advertising</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            BiteBuddy displays advertisements served by Google AdSense and other advertising networks. These ads help
            keep our recipes free and support continued recipe development.
          </p>

          <h3 className="text-xl font-semibold mb-3 mt-6">2.2 How Advertising Works</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li><strong>Personalized Ads:</strong> If you consent to advertising cookies, you may see ads personalized based on your browsing behavior</li>
            <li><strong>Non-Personalized Ads:</strong> If you decline advertising cookies, you'll see generic ads that aren't based on your behavior</li>
            <li><strong>Third-Party Cookies:</strong> Advertising partners may use cookies to track ad performance and frequency</li>
            <li><strong>No Direct Control:</strong> We don't control which specific ads appear, but we use Google AdSense's controls to block inappropriate categories</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">2.3 Managing Ad Preferences</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            You can control your ad experience through:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>
              Our <Link href="/privacy" className="text-emerald-600 hover:underline">Cookie Consent banner</Link> (choose "Essential Only" to decline advertising cookies)
            </li>
            <li>
              <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                Google Ad Settings
              </a> to manage personalized advertising
            </li>
            <li>
              Browser extensions that block ads (though this removes our primary revenue source)
            </li>
          </ul>
        </section>

        {/* Recipe Accuracy Disclaimer */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Recipe Accuracy & Results Disclaimer</h2>

          <h3 className="text-xl font-semibold mb-3 mt-6">3.1 "Copycat" Recipes</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            BiteBuddy creates "copycat" or "clone" recipes inspired by popular UK restaurant dishes.
            <strong> These are not official recipes from the restaurants</strong> — they are our interpretations
            based on taste testing, ingredient research, and culinary techniques.
          </p>

          <h3 className="text-xl font-semibold mb-3 mt-6">3.2 No Guarantee of Identical Results</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            While we strive to recreate the taste and texture of original restaurant dishes:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li>We cannot guarantee results will be 100% identical to restaurant versions</li>
            <li>Restaurants often use commercial equipment, proprietary ingredients, or secret techniques we can't replicate</li>
            <li>Individual results may vary based on ingredient brands, equipment, skill level, and environmental factors</li>
            <li>Cooking times and temperatures may need adjustment based on your specific equipment</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">3.3 Nutrition Information</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Nutrition data provided with recipes is calculated using standard ingredient databases and is approximate only.
            Actual nutrition values may vary based on:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Specific brands of ingredients used</li>
            <li>Accuracy of measurements</li>
            <li>Cooking methods and temperatures</li>
            <li>Portion sizes</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-4">
            <strong>If you have specific dietary requirements or restrictions, please verify nutrition information
            independently and consult with a healthcare professional.</strong>
          </p>

          <h3 className="text-xl font-semibold mb-3 mt-6">3.4 Food Safety</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            While we provide cooking temperatures and food safety guidance, you are ultimately responsible for
            food safety in your own kitchen. Follow proper food handling, storage, and cooking practices.
            When in doubt, consult official UK Food Standards Agency guidelines.
          </p>
        </section>

        {/* Brand Affiliation Disclaimer */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Restaurant & Brand Affiliation Disclaimer</h2>

          <h3 className="text-xl font-semibold mb-3 mt-6">4.1 No Official Affiliation</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>BiteBuddy is not affiliated with, endorsed by, or connected to any of the restaurant chains,
            brands, or companies whose dishes we recreate.</strong>
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            This includes but is not limited to: Greggs, Nando's, Wagamama, KFC, McDonald's, Pret A Manger,
            Subway, Pizza Hut, Domino's, Five Guys, and any other brands mentioned on our website.
          </p>

          <h3 className="text-xl font-semibold mb-3 mt-6">4.2 Trademark Usage</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Restaurant and brand names are used solely for identification and comparison purposes to help users
            understand which dishes our recipes are inspired by. This is considered fair use under UK law.
          </p>
          <p className="text-gray-700 leading-relaxed">
            All trademarks, logos, and brand names belong to their respective owners. We make no claim to these
            trademarks.
          </p>
        </section>

        {/* AI-Generated Content */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">5. AI-Generated Recipe Disclaimer</h2>

          <h3 className="text-xl font-semibold mb-3 mt-6">5.1 AI Recipe Generator Feature</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            BiteBuddy offers an AI Recipe Generator feature that uses artificial intelligence (powered by OpenAI)
            to create recipe suggestions based on your preferences.
          </p>

          <h3 className="text-xl font-semibold mb-3 mt-6">5.2 AI Recipe Limitations</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li>AI-generated recipes have not been kitchen-tested by our team</li>
            <li>Ingredient quantities, cooking times, and methods may require adjustment</li>
            <li>Results are not guaranteed and may vary significantly</li>
            <li>AI can occasionally suggest unusual or impractical ingredient combinations</li>
            <li>Users should apply their own culinary judgment when following AI-generated recipes</li>
          </ul>

          <p className="text-gray-700 leading-relaxed">
            <strong>We recommend treating AI-generated recipes as starting points or inspiration rather than
            tested, proven recipes.</strong> For reliable results, use our regular curated recipes.
          </p>
        </section>

        {/* Limitation of Liability */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            BiteBuddy provides recipes and cooking information for educational and entertainment purposes.
            We make every effort to ensure accuracy, but:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li>We are not liable for any adverse results from following our recipes</li>
            <li>We are not responsible for allergic reactions, food poisoning, or other health issues</li>
            <li>We cannot guarantee specific dietary, nutrition, or health outcomes</li>
            <li>Users are responsible for verifying ingredient safety and suitability for their needs</li>
          </ul>
          <p className="text-gray-700 leading-relaxed">
            By using BiteBuddy, you agree to use recipes at your own risk and take responsibility for your
            own cooking, food safety, and dietary choices.
          </p>
        </section>

        {/* Professional Advice Disclaimer */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Not Professional Advice</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            The information on BiteBuddy is for general informational purposes only and should not be considered:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li><strong>Medical or nutritional advice:</strong> Consult healthcare professionals for dietary guidance</li>
            <li><strong>Professional culinary training:</strong> We provide home cooking guidance, not professional chef instruction</li>
            <li><strong>Food safety certification:</strong> Follow official UK Food Standards Agency guidelines</li>
            <li><strong>Allergy guidance:</strong> Always verify ingredients and consult medical professionals about allergies</li>
          </ul>
        </section>

        {/* Changes to Disclosures */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">8. Changes to This Disclaimer</h2>
          <p className="text-gray-700 leading-relaxed">
            We may update this Disclaimer from time to time as our partnerships, features, or legal requirements
            change. We will update the "Last Updated" date at the top of this page. Continued use of BiteBuddy
            after changes constitutes acceptance of the updated disclaimer.
          </p>
        </section>

        {/* Contact Information */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">9. Questions About These Disclosures</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            If you have questions about our affiliate relationships, advertising, or any disclaimers, please contact us:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
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
            <p className="text-gray-700 mt-3">
              <strong>Contact Page:</strong>{" "}
              <Link href="/contact" className="text-emerald-600 hover:underline">
                https://bitebuddy.co.uk/contact
              </Link>
            </p>
          </div>
        </section>

        {/* Related Pages */}
        <section className="border-t pt-8 mt-8">
          <h2 className="text-2xl font-semibold mb-4">Related Legal Pages</h2>
          <ul className="space-y-2 text-gray-700">
            <li>
              <Link href="/privacy" className="text-emerald-600 hover:underline">
                Privacy Policy
              </Link> - How we collect and use your data
            </li>
            <li>
              <Link href="/terms" className="text-emerald-600 hover:underline">
                Terms of Service
              </Link> - Rules for using BiteBuddy
            </li>
            <li>
              <Link href="/about" className="text-emerald-600 hover:underline">
                About Us
              </Link> - Learn about Jonathan and BiteBuddy
            </li>
            <li>
              <Link href="/contact" className="text-emerald-600 hover:underline">
                Contact Us
              </Link> - Get in touch with questions
            </li>
          </ul>
        </section>

        {/* Summary Box */}
        <section className="bg-emerald-50 border-l-4 border-emerald-600 p-6 rounded-r-lg">
          <h3 className="font-semibold text-emerald-900 mb-3">In Plain English:</h3>
          <ul className="text-emerald-800 text-sm space-y-2">
            <li>✅ We earn commissions from affiliate links (at no cost to you)</li>
            <li>✅ We display ads (Google AdSense) to keep recipes free</li>
            <li>✅ Our recipes are copycat interpretations, not official restaurant recipes</li>
            <li>✅ Results may vary — cooking is an art and a science!</li>
            <li>✅ We're not affiliated with any restaurant brands</li>
            <li>✅ AI-generated recipes are experimental and untested</li>
            <li>✅ You're responsible for your own food safety and dietary choices</li>
            <li>✅ Questions? Email us at hello@bitebuddy.co.uk</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
