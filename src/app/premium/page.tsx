"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useSubscription } from "@/hooks/useSubscription";
import UpgradeModal from "@/components/UpgradeModal";
import { useRouter } from "next/navigation";

export default function PremiumPage() {
  const [user, setUser] = useState<any>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { isPremium } = useSubscription();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  // Redirect if already premium
  useEffect(() => {
    if (isPremium) {
      router.push("/account");
    }
  }, [isPremium, router]);

  const handleUpgrade = () => {
    if (!user) {
      router.push("/account");
      return;
    }
    setShowUpgradeModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50">
      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-4 py-16 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-900 mb-6">
          <span>⭐</span>
          <span>Unlock Premium Features</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Take Your Cooking to the Next Level
        </h1>

        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Get unlimited AI recipes, advanced meal planning, and an ad-free experience
        </p>

        <button
          onClick={handleUpgrade}
          className="rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 px-8 py-4 text-lg font-semibold text-white hover:from-emerald-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all"
        >
          Upgrade to Premium
        </button>
      </section>

      {/* Pricing Cards */}
      <section className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-12">Choose Your Plan</h2>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Monthly Plan */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 hover:border-emerald-500 transition-colors">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Monthly</h3>
              <div className="text-4xl font-bold text-gray-900">£4.99</div>
              <div className="text-gray-600">per month</div>
              <div className="text-sm text-gray-500 mt-1">Billed monthly</div>
            </div>
            <button
              onClick={handleUpgrade}
              className="w-full rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700 transition-colors"
            >
              Get Started
            </button>
          </div>

          {/* Yearly Plan */}
          <div className="bg-white rounded-2xl border-2 border-emerald-500 p-8 relative shadow-lg">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-sm font-bold px-4 py-1 rounded-full">
              Save 35%
            </div>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Yearly</h3>
              <div className="text-4xl font-bold text-gray-900">£39</div>
              <div className="text-gray-600">per year</div>
              <div className="text-sm text-emerald-600 font-semibold mt-1">Just £3.25/month</div>
            </div>
            <button
              onClick={handleUpgrade}
              className="w-full rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3 font-semibold text-white hover:from-emerald-600 hover:to-emerald-700 transition-all"
            >
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Everything You Get</h2>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Feature</th>
                <th className="px-6 py-4 text-center font-semibold text-gray-900">Free</th>
                <th className="px-6 py-4 text-center font-semibold bg-emerald-50 text-emerald-900">Premium ⭐</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 font-medium text-gray-900">Meal Planner</td>
                <td className="px-6 py-4 text-center text-gray-600">3 days</td>
                <td className="px-6 py-4 text-center bg-emerald-50 font-semibold text-emerald-700">14 days</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-gray-900">Export Meal Plan to PDF</td>
                <td className="px-6 py-4 text-center text-gray-400">✗</td>
                <td className="px-6 py-4 text-center bg-emerald-50 text-emerald-700">✓</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-gray-900">AI Recipe Generator</td>
                <td className="px-6 py-4 text-center text-gray-600">1 per day</td>
                <td className="px-6 py-4 text-center bg-emerald-50 font-semibold text-emerald-700">Unlimited</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-gray-900">Save Recipes</td>
                <td className="px-6 py-4 text-center text-emerald-600">✓</td>
                <td className="px-6 py-4 text-center bg-emerald-50 text-emerald-700">✓</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-gray-900">Shopping List Generator</td>
                <td className="px-6 py-4 text-center text-emerald-600">✓</td>
                <td className="px-6 py-4 text-center bg-emerald-50 text-emerald-700">✓</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-gray-900">Ad-Free Experience</td>
                <td className="px-6 py-4 text-center text-gray-400">✗</td>
                <td className="px-6 py-4 text-center bg-emerald-50 text-emerald-700">✓</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-gray-900">Priority Support</td>
                <td className="px-6 py-4 text-center text-gray-400">✗</td>
                <td className="px-6 py-4 text-center bg-emerald-50 text-emerald-700">✓</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQs */}
      <section className="mx-auto max-w-4xl px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>

        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-lg text-gray-900 mb-2">Can I cancel anytime?</h3>
            <p className="text-gray-600">Yes! You can cancel your subscription at any time from your account settings. No commitments, no hassle.</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-lg text-gray-900 mb-2">What payment methods do you accept?</h3>
            <p className="text-gray-600">We accept all major credit and debit cards through our secure payment partner, Stripe.</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-lg text-gray-900 mb-2">Is there a free trial?</h3>
            <p className="text-gray-600">You can try many features for free! The free plan includes recipe saving, 3-day meal planning, and 1 AI recipe per day.</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-lg text-gray-900 mb-2">What's the difference between monthly and yearly?</h3>
            <p className="text-gray-600">Both plans include identical features. The yearly plan saves you 35% (works out to £3.25/month vs £4.99/month).</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-4xl px-4 py-16 text-center">
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-emerald-50 mb-8">
            Join thousands of home cooks unlocking their culinary potential
          </p>
          <button
            onClick={handleUpgrade}
            className="rounded-full bg-white px-8 py-4 text-lg font-semibold text-emerald-600 hover:bg-emerald-50 shadow-lg hover:shadow-xl transition-all"
          >
            Upgrade to Premium
          </button>
        </div>
      </section>

      {/* Upgrade Modal */}
      {showUpgradeModal && user && (
        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          userId={user.id}
        />
      )}
    </div>
  );
}
