"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export default function UpgradeModal({ isOpen, onClose, userId }: UpgradeModalProps) {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("monthly");
  const [promoCode, setPromoCode] = useState("");

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, plan: selectedPlan, promoCode: promoCode.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Checkout error:", data);
        alert(`Failed to start checkout: ${data.error || 'Please try again.'}`);
        setLoading(false);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      alert("Failed to start checkout. Please try again.");
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Upgrade to Premium</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Premium Badge */}
          <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">⭐</span>
              <h3 className="text-xl font-semibold text-emerald-900">Bite Buddy Premium</h3>
            </div>
            <p className="text-emerald-800 text-sm">Unlock all features and enhance your cooking experience</p>
          </div>

          {/* Pricing Plans */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Monthly Plan */}
            <button
              onClick={() => setSelectedPlan("monthly")}
              className={`relative rounded-lg border-2 p-4 transition-all ${
                selectedPlan === "monthly"
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-gray-200 hover:border-emerald-300"
              }`}
            >
              {selectedPlan === "monthly" && (
                <div className="absolute -top-3 right-3 bg-emerald-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                  Selected
                </div>
              )}
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">£4.99</div>
                <div className="text-sm text-gray-600">per month</div>
                <div className="text-xs text-gray-500 mt-1">Billed monthly</div>
              </div>
            </button>

            {/* Yearly Plan */}
            <button
              onClick={() => setSelectedPlan("yearly")}
              className={`relative rounded-lg border-2 p-4 transition-all ${
                selectedPlan === "yearly"
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-gray-200 hover:border-emerald-300"
              }`}
            >
              <div className="absolute -top-3 left-3 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                Save 35%
              </div>
              {selectedPlan === "yearly" && (
                <div className="absolute -top-3 right-3 bg-emerald-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                  Selected
                </div>
              )}
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">£39</div>
                <div className="text-sm text-gray-600">per year</div>
                <div className="text-xs text-gray-500 mt-1">£3.25/month</div>
              </div>
            </button>
          </div>

          <p className="text-sm text-gray-600 text-center mb-6">Cancel anytime. No commitments.</p>

          {/* Promo Code Input */}
          <div className="mb-6">
            <label htmlFor="promo-code" className="block text-sm font-medium text-gray-700 mb-2">
              Have a discount code?
            </label>
            <input
              id="promo-code"
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Enter code"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </div>

          {/* Features List */}
          <div className="space-y-4 mb-6">
            <h4 className="font-semibold text-gray-900">Premium Features:</h4>

            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <div className="font-medium text-gray-900">14-Day Meal Planner</div>
                <p className="text-sm text-gray-600">Plan meals 2 weeks ahead (Free: 3 days)</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <div className="font-medium text-gray-900">Export Meal Plan to PDF</div>
                <p className="text-sm text-gray-600">Download and print your 14-day meal plan</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <div className="font-medium text-gray-900">Unlimited AI Recipe Generator</div>
                <p className="text-sm text-gray-600">Create custom recipes anytime (Free: 1 per day)</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <div className="font-medium text-gray-900">Ad-Free Experience</div>
                <p className="text-sm text-gray-600">Enjoy distraction-free browsing</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <div className="font-medium text-gray-900">Save Recipes</div>
                <p className="text-sm text-gray-600">Save both published and AI-generated recipes (Free users can save too!)</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <div className="font-medium text-gray-900">Priority Support</div>
                <p className="text-sm text-gray-600">Get help faster when you need it</p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full bg-emerald-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Loading..." : "Upgrade to Premium"}
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            Secure payment powered by Stripe. Cancel anytime from your account settings.
          </p>
        </div>
      </div>
    </div>
  );
}
