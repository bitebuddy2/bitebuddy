"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useSubscription } from "@/hooks/useSubscription";

type UserPreferences = {
  default_serving_size: number;
  preferred_units: "metric" | "imperial";
  default_dietary_restrictions: string[];
  default_spice_level: "mild" | "medium" | "hot";
  default_cooking_methods: string[];
  show_name_on_recipes: boolean;
  profile_public: boolean;
  email_comments: boolean;
  email_replies: boolean;
  email_weekly_roundup: boolean;
  email_features: boolean;
  email_meal_reminders: boolean;
};

const DIETARY_OPTIONS = [
  "vegetarian",
  "vegan",
  "pescatarian",
  "gluten-free",
  "dairy-free",
  "nut-free",
  "halal",
  "kosher",
];

const COOKING_METHODS = [
  "bake",
  "grill",
  "air fry",
  "pan fry",
  "slow cooker",
  "instant pot",
  "microwave",
  "no cook",
];

export default function AccountSettings({
  user,
  onDeleteAccount,
  showDeleteConfirm,
  setShowDeleteConfirm,
  deleteConfirmText,
  setDeleteConfirmText,
  isDeletingAccount,
}: {
  user: any;
  onDeleteAccount: () => void;
  showDeleteConfirm: boolean;
  setShowDeleteConfirm: (show: boolean) => void;
  deleteConfirmText: string;
  setDeleteConfirmText: (text: string) => void;
  isDeletingAccount: boolean;
}) {
  const [firstName, setFirstName] = useState(user?.user_metadata?.first_name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [preferences, setPreferences] = useState<UserPreferences>({
    default_serving_size: 4,
    preferred_units: "metric",
    default_dietary_restrictions: [],
    default_spice_level: "medium",
    default_cooking_methods: [],
    show_name_on_recipes: true,
    profile_public: true,
    email_comments: true,
    email_replies: true,
    email_weekly_roundup: false,
    email_features: true,
    email_meal_reminders: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const { isPremium, subscription } = useSubscription();

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 is "not found" error
        throw error;
      }

      if (data) {
        setPreferences(data);
      }
    } catch (error) {
      console.error("Error fetching preferences:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAccountInfo = async () => {
    setSaving(true);
    setMessage(null);

    try {
      // Update user metadata
      const { error: metadataError } = await supabase.auth.updateUser({
        data: { first_name: firstName },
      });

      if (metadataError) throw metadataError;

      // Update email if changed
      if (email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: email,
        });

        if (emailError) throw emailError;

        setMessage({
          type: "success",
          text: "Account updated! Check your email to confirm the new address.",
        });
      } else {
        setMessage({ type: "success", text: "Account information updated successfully!" });
      }
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Failed to update account" });
    } finally {
      setSaving(false);
    }
  };

  const handleSavePreferences = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase.from("user_preferences").upsert(
        {
          user_id: user.id,
          ...preferences,
        },
        { onConflict: "user_id" }
      );

      if (error) throw error;

      setMessage({ type: "success", text: "Preferences saved successfully!" });
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Failed to save preferences" });
    } finally {
      setSaving(false);
    }
  };

  const toggleDietaryRestriction = (restriction: string) => {
    setPreferences((prev) => ({
      ...prev,
      default_dietary_restrictions: prev.default_dietary_restrictions.includes(restriction)
        ? prev.default_dietary_restrictions.filter((r) => r !== restriction)
        : [...prev.default_dietary_restrictions, restriction],
    }));
  };

  const toggleCookingMethod = (method: string) => {
    setPreferences((prev) => ({
      ...prev,
      default_cooking_methods: prev.default_cooking_methods.includes(method)
        ? prev.default_cooking_methods.filter((m) => m !== method)
        : [...prev.default_cooking_methods, method],
    }));
  };

  const handleManageSubscription = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch("/api/create-portal-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to open billing portal");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">Loading settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8">
      <h2 className="text-2xl font-bold">Account Settings</h2>

      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Account Information */}
      <section className="bg-white rounded-lg border p-6 space-y-4">
        <h3 className="text-lg font-semibold">Account Information</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="your@email.com"
          />
          <p className="text-xs text-gray-500 mt-1">
            Changing your email will require verification
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <a
            href="/account?mode=reset-password"
            className="text-sm text-emerald-600 hover:text-emerald-700"
          >
            Reset Password →
          </a>
        </div>

        <button
          onClick={handleSaveAccountInfo}
          disabled={saving}
          className="rounded-lg bg-emerald-600 px-6 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Account Info"}
        </button>
      </section>

      {/* Recipe Preferences */}
      <section className="bg-white rounded-lg border p-6 space-y-4">
        <h3 className="text-lg font-semibold">Recipe Preferences</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Default Serving Size
          </label>
          <input
            type="number"
            min="1"
            max="12"
            value={preferences.default_serving_size}
            onChange={(e) =>
              setPreferences({ ...preferences, default_serving_size: parseInt(e.target.value) })
            }
            className="w-24 rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Used when generating AI recipes</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Units
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                checked={preferences.preferred_units === "metric"}
                onChange={() => setPreferences({ ...preferences, preferred_units: "metric" })}
                className="mr-2"
              />
              <span className="text-sm">Metric (g, ml, °C)</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                checked={preferences.preferred_units === "imperial"}
                onChange={() => setPreferences({ ...preferences, preferred_units: "imperial" })}
                className="mr-2"
              />
              <span className="text-sm">Imperial (oz, cups, °F)</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Default Dietary Restrictions
          </label>
          <div className="flex flex-wrap gap-2">
            {DIETARY_OPTIONS.map((option) => (
              <button
                key={option}
                onClick={() => toggleDietaryRestriction(option)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  preferences.default_dietary_restrictions.includes(option)
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Default Spice Level
          </label>
          <div className="flex gap-4">
            {(["mild", "medium", "hot"] as const).map((level) => (
              <label key={level} className="flex items-center">
                <input
                  type="radio"
                  checked={preferences.default_spice_level === level}
                  onChange={() => setPreferences({ ...preferences, default_spice_level: level })}
                  className="mr-2"
                />
                <span className="text-sm capitalize">{level}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Cooking Methods
          </label>
          <div className="flex flex-wrap gap-2">
            {COOKING_METHODS.map((method) => (
              <button
                key={method}
                onClick={() => toggleCookingMethod(method)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  preferences.default_cooking_methods.includes(method)
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {method}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSavePreferences}
          disabled={saving}
          className="rounded-lg bg-emerald-600 px-6 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Preferences"}
        </button>
      </section>

      {/* Privacy Settings */}
      <section className="bg-white rounded-lg border p-6 space-y-4">
        <h3 className="text-lg font-semibold">Privacy Settings</h3>

        <label className="flex items-start">
          <input
            type="checkbox"
            checked={preferences.show_name_on_recipes}
            onChange={(e) =>
              setPreferences({ ...preferences, show_name_on_recipes: e.target.checked })
            }
            className="mt-1 mr-3"
          />
          <div>
            <div className="text-sm font-medium text-gray-900">Show name on published recipes</div>
            <div className="text-xs text-gray-500">
              Display your name when you publish recipes to the community
            </div>
          </div>
        </label>

        <label className="flex items-start">
          <input
            type="checkbox"
            checked={preferences.profile_public}
            onChange={(e) => setPreferences({ ...preferences, profile_public: e.target.checked })}
            className="mt-1 mr-3"
          />
          <div>
            <div className="text-sm font-medium text-gray-900">Public profile</div>
            <div className="text-xs text-gray-500">
              Allow others to see your published recipes and activity
            </div>
          </div>
        </label>

        <button
          onClick={handleSavePreferences}
          disabled={saving}
          className="rounded-lg bg-emerald-600 px-6 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Privacy Settings"}
        </button>
      </section>

      {/* Notification Preferences */}
      <section className="bg-white rounded-lg border p-6 space-y-4">
        <h3 className="text-lg font-semibold">Notification Preferences</h3>

        <label className="flex items-start">
          <input
            type="checkbox"
            checked={preferences.email_comments}
            onChange={(e) => setPreferences({ ...preferences, email_comments: e.target.checked })}
            className="mt-1 mr-3"
          />
          <div>
            <div className="text-sm font-medium text-gray-900">Comments on your recipes</div>
            <div className="text-xs text-gray-500">
              Get notified when someone comments on your published recipes
            </div>
          </div>
        </label>

        <label className="flex items-start">
          <input
            type="checkbox"
            checked={preferences.email_replies}
            onChange={(e) => setPreferences({ ...preferences, email_replies: e.target.checked })}
            className="mt-1 mr-3"
          />
          <div>
            <div className="text-sm font-medium text-gray-900">Replies to your comments</div>
            <div className="text-xs text-gray-500">
              Get notified when someone replies to your comments (coming soon)
            </div>
          </div>
        </label>

        <label className="flex items-start">
          <input
            type="checkbox"
            checked={preferences.email_weekly_roundup}
            onChange={(e) =>
              setPreferences({ ...preferences, email_weekly_roundup: e.target.checked })
            }
            className="mt-1 mr-3"
          />
          <div>
            <div className="text-sm font-medium text-gray-900">Weekly recipe roundup</div>
            <div className="text-xs text-gray-500">
              Receive a weekly email with popular recipes and new additions
            </div>
          </div>
        </label>

        <label className="flex items-start">
          <input
            type="checkbox"
            checked={preferences.email_features}
            onChange={(e) => setPreferences({ ...preferences, email_features: e.target.checked })}
            className="mt-1 mr-3"
          />
          <div>
            <div className="text-sm font-medium text-gray-900">Feature announcements</div>
            <div className="text-xs text-gray-500">
              Stay updated on new features and improvements
            </div>
          </div>
        </label>

        <label className="flex items-start">
          <input
            type="checkbox"
            checked={preferences.email_meal_reminders}
            onChange={(e) =>
              setPreferences({ ...preferences, email_meal_reminders: e.target.checked })
            }
            className="mt-1 mr-3"
          />
          <div>
            <div className="text-sm font-medium text-gray-900">Meal planner reminders</div>
            <div className="text-xs text-gray-500">
              Get reminders for your scheduled meals
            </div>
          </div>
        </label>

        <button
          onClick={handleSavePreferences}
          disabled={saving}
          className="rounded-lg bg-emerald-600 px-6 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Notification Preferences"}
        </button>
      </section>

      {/* Subscription Management */}
      <section className="bg-white rounded-lg border p-6 space-y-4">
        <h3 className="text-lg font-semibold">Subscription</h3>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-gray-900">
              Current Plan: <span className="text-emerald-600">{isPremium ? "Premium" : "Free"}</span>
            </div>
            {subscription && (
              <div className="text-xs text-gray-500 mt-1">
                Status: {subscription.status}
              </div>
            )}
          </div>

          {subscription?.stripe_customer_id ? (
            <button
              onClick={handleManageSubscription}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Manage Subscription
            </button>
          ) : !isPremium ? (
            <a
              href="/premium"
              className="rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-sm font-semibold text-white hover:from-amber-600 hover:to-orange-600"
            >
              Upgrade to Premium
            </a>
          ) : null}
        </div>
      </section>

      {/* Export Data */}
      <section className="bg-white rounded-lg border p-6 space-y-4">
        <h3 className="text-lg font-semibold">Export Your Data</h3>

        <p className="text-sm text-gray-600">
          Download all your saved recipes, meal plans, and preferences in JSON format.
        </p>

        <button
          onClick={async () => {
            try {
              const {
                data: { session },
              } = await supabase.auth.getSession();
              if (!session) return;

              const response = await fetch("/api/export-user-data", {
                headers: {
                  Authorization: `Bearer ${session.access_token}`,
                },
              });

              const data = await response.json();
              const blob = new Blob([JSON.stringify(data, null, 2)], {
                type: "application/json",
              });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `bitebuddy-data-${new Date().toISOString().split("T")[0]}.json`;
              a.click();
            } catch (error) {
              alert("Failed to export data");
            }
          }}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          Download My Data
        </button>
      </section>

      {/* Delete Account Section */}
      <section className="bg-red-50 rounded-lg border border-red-200 p-6">
        <h3 className="text-lg font-semibold text-red-900 mb-2">Delete Account</h3>
        <p className="text-sm text-red-700 mb-4">
          Once you delete your account, there is no going back. This will permanently delete your
          account, saved recipes, meal plans, and all associated data.
        </p>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
          >
            Delete My Account
          </button>
        ) : (
          <div className="space-y-4">
            <div>
              <label htmlFor="deleteConfirm" className="block text-sm font-medium text-red-900 mb-2">
                Type <span className="font-bold">DELETE</span> to confirm:
              </label>
              <input
                id="deleteConfirm"
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className="w-full max-w-xs rounded-lg border border-red-300 px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="DELETE"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={onDeleteAccount}
                disabled={isDeletingAccount || deleteConfirmText !== "DELETE"}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isDeletingAccount ? "Deleting..." : "Confirm Delete Account"}
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteConfirmText("");
                }}
                disabled={isDeletingAccount}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
