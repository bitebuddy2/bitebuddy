import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY is not set");
      return NextResponse.json({ error: "Stripe configuration error" }, { status: 500 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-09-30.clover",
    });

    const { userId, plan, promoCode } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // Determine which price ID to use
    const priceId = plan === "yearly"
      ? process.env.STRIPE_PRICE_ID_YEARLY
      : process.env.STRIPE_PRICE_ID_MONTHLY;

    console.log("Plan:", plan);
    console.log("Price ID:", priceId);
    console.log("STRIPE_PRICE_ID_MONTHLY:", process.env.STRIPE_PRICE_ID_MONTHLY);
    console.log("STRIPE_PRICE_ID_YEARLY:", process.env.STRIPE_PRICE_ID_YEARLY);

    if (!priceId) {
      return NextResponse.json({ error: "Invalid plan selected" }, { status: 400 });
    }

    // Create Stripe checkout session
    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/account?upgrade=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/account?upgrade=cancelled`,
      metadata: {
        user_id: userId,
      },
      allow_promotion_codes: !promoCode, // Enable promotion code field if no code provided
    };

    // Add promotion code if provided
    if (promoCode) {
      sessionConfig.discounts = [{ promotion_code: promoCode }];
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (err: any) {
    console.error("Error creating checkout session:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
