import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  status: string;
  cancel_at_period_end: boolean;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

export function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    async function fetchSubscription() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("user_subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setSubscription(data);
        // User is premium if they have an active subscription
        setIsPremium(data.status === "active" || data.status === "trialing");
      }

      setLoading(false);
    }

    fetchSubscription();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      fetchSubscription();
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { subscription, isPremium, loading };
}
