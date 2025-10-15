import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Features | Bite Buddy",
  description: "Discover all the features that make Bite Buddy the best place for UK copycat recipes, AI-generated meal ideas, and meal planning.",
};

export default function FeaturesPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Everything You Need to Cook Better
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          From saving recipes to generating AI meal plans, Bite Buddy has all the tools you need to make cooking easier and more enjoyable.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {/* Feature 1 */}
        <div className="bg-white rounded-2xl border-2 border-emerald-200 p-8 hover:shadow-lg transition-shadow">
          <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Save Unlimited Recipes</h2>
          <p className="text-gray-700 mb-4">
            Save your favorite recipes and access them from any device. Build your personal cookbook with recipes from top UK brands like Greggs, Nando's, and Wagamama.
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span>Unlimited recipe saves (100% free)</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span>Access from phone, tablet, or computer</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span>Organize by brand, category, or favorite</span>
            </li>
          </ul>
        </div>

        {/* Feature 2 */}
        <div className="bg-white rounded-2xl border-2 border-purple-200 p-8 hover:shadow-lg transition-shadow">
          <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 7H7v6h6V7z"/>
              <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">AI Recipe Generator</h2>
          <p className="text-gray-700 mb-4">
            Turn any ingredients into delicious recipes with our AI-powered generator. Perfect for using up leftovers or creating new meal ideas.
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span>1 free recipe per day (forever)</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span>Customize by diet, spice level, and cooking method</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span>Includes nutrition info and cooking tips</span>
            </li>
          </ul>
        </div>

        {/* Feature 3 */}
        <div className="bg-white rounded-2xl border-2 border-blue-200 p-8 hover:shadow-lg transition-shadow">
          <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Smart Meal Planner</h2>
          <p className="text-gray-700 mb-4">
            Plan your meals for the week ahead. Add recipes to specific days and generate shopping lists automatically.
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span>3-day planning (free) or 14-day (premium)</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span>Drag and drop interface</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span>Export to PDF (premium)</span>
            </li>
          </ul>
        </div>

        {/* Feature 4 */}
        <div className="bg-white rounded-2xl border-2 border-orange-200 p-8 hover:shadow-lg transition-shadow">
          <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Shopping List Generator</h2>
          <p className="text-gray-700 mb-4">
            Add recipes to your shopping list and we'll consolidate all the ingredients. Perfect for your weekly shop.
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span>Automatic ingredient consolidation</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span>Check off items as you shop</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span>Print or access on your phone</span>
            </li>
          </ul>
        </div>

        {/* Feature 5 - Recipe Scaling */}
        <div className="bg-white rounded-2xl border-2 border-teal-200 p-8 hover:shadow-lg transition-shadow">
          <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Recipe Scaling</h2>
          <p className="text-gray-700 mb-4">
            Adjust recipe servings instantly with automatic ingredient recalculation. Perfect for cooking for one or feeding a crowd.
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span>One-click servings adjustment with +/- buttons</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span>Smart fraction handling (¼, ½, ¾, ⅓, ⅔)</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span>Reset to original servings anytime</span>
            </li>
          </ul>
        </div>

        {/* Feature 6 - Cooking Mode */}
        <div className="bg-white rounded-2xl border-2 border-indigo-200 p-8 hover:shadow-lg transition-shadow">
          <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Cooking Mode</h2>
          <p className="text-gray-700 mb-4">
            Distraction-free cooking view with enlarged text and hands-free convenience. Perfect for cooking from your tablet or phone.
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span>Large, easy-to-read text for distance viewing</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span>Keeps screen awake while you cook</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span>Hides ads, comments, and distractions</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Why Create an Account Section */}
      <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-3xl p-12 text-white mb-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Create a Free Account?
          </h2>
          <p className="text-xl text-emerald-50 mb-8">
            Join 10,000+ home cooks who are cooking better with Bite Buddy
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8 text-left">
            <div>
              <div className="text-4xl mb-2">💚</div>
              <h3 className="font-semibold mb-1">Always Free</h3>
              <p className="text-sm text-emerald-100">No credit card required. Most features are 100% free forever.</p>
            </div>
            <div>
              <div className="text-4xl mb-2">⚡</div>
              <h3 className="font-semibold mb-1">Quick Setup</h3>
              <p className="text-sm text-emerald-100">Takes just 30 seconds to create an account and start cooking.</p>
            </div>
            <div>
              <div className="text-4xl mb-2">🔒</div>
              <h3 className="font-semibold mb-1">Private & Secure</h3>
              <p className="text-sm text-emerald-100">Your data is encrypted and we never share your information.</p>
            </div>
          </div>

          <Link
            href="/account"
            className="inline-block bg-white text-emerald-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-emerald-50 transition-colors shadow-lg"
          >
            Create Free Account
          </Link>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Frequently Asked Questions
        </h2>

        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-lg text-gray-900 mb-2">
              Is Bite Buddy really free?
            </h3>
            <p className="text-gray-700">
              Yes! All core features including saving recipes, meal planning (3 days), shopping lists, and 1 AI recipe per day are completely free forever. We also offer a premium plan (£4.99/month) with extended meal planning and unlimited AI recipes.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-lg text-gray-900 mb-2">
              Do I need to download an app?
            </h3>
            <p className="text-gray-700">
              No app required! Bite Buddy works in your web browser on any device - phone, tablet, or computer. Just create an account and start using it immediately.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-lg text-gray-900 mb-2">
              Can I share my recipes with family and friends?
            </h3>
            <p className="text-gray-700">
              Absolutely! Every recipe has share buttons for Facebook, Twitter, Pinterest, WhatsApp, and email. You can also print recipes in a clean, printer-friendly format or use cooking mode for hands-free viewing on your tablet.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-lg text-gray-900 mb-2">
              Can I adjust recipe serving sizes?
            </h3>
            <p className="text-gray-700">
              Yes! Every recipe has built-in scaling. Use the +/- buttons to adjust servings and all ingredient quantities update automatically with smart fraction handling (like ¼, ½, ¾). Perfect for cooking for one or feeding a crowd.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-lg text-gray-900 mb-2">
              How does the AI recipe generator work?
            </h3>
            <p className="text-gray-700">
              Our AI analyzes your ingredients and preferences (cooking method, dietary requirements, spice level) to create completely custom recipes with step-by-step instructions, nutrition info, and cooking tips.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-lg text-gray-900 mb-2">
              What's included in the premium plan?
            </h3>
            <p className="text-gray-700">
              Premium includes: 14-day meal planning (vs 3-day free), PDF export for meal plans, unlimited AI recipe generation (vs 1/day free), ad-free experience, and priority support. It costs £4.99/month or £39/year (save 35%).
            </p>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="text-center mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Ready to start cooking better?
        </h2>
        <Link
          href="/account"
          className="inline-block bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors shadow-md"
        >
          Create Free Account
        </Link>
        <p className="text-sm text-gray-600 mt-3">
          Takes 30 seconds · No credit card required · Always free
        </p>
      </div>
    </main>
  );
}
