"use client";

import IngredientFinder from "@/components/IngredientFinder";
import Link from "next/link";
import Image from "next/image";
import { useSubscription } from "@/hooks/useSubscription";

export default function AIRecipeGeneratorPage() {
  const { isPremium } = useSubscription();
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <Image
            src="/AI.svg"
            alt="AI Recipe Generator"
            width={240}
            height={240}
            priority
          />
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 mb-4">
          Free AI Recipe Generator
        </h1>

        <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-6">
          Turn your ingredients into restaurant-quality recipes in seconds. Our AI recipe maker creates personalized meal ideas tailored to your preferences.
        </p>

        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 mb-8">
          {isPremium ? (
            <>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-semibold">Premium Member</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Unlimited Recipes</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Priority Generation</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Free Account</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>1 Free Daily</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Instant Results</span>
              </div>
            </>
          )}
        </div>
      </section>

      {/* AI Recipe Generator Component */}
      <IngredientFinder />

      {/* SEO Content Section */}
      <section className="mt-16 prose prose-lg max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          How Does Our AI Recipe Generator Work?
        </h2>

        <p className="text-gray-700 mb-6">
          Our AI recipe generator uses advanced artificial intelligence to transform your ingredients into delicious, restaurant-quality recipes. Simply enter what you have in your kitchen, and our AI recipe maker will create personalized meal ideas in seconds.
        </p>

        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          Why Use an AI Recipe Generator?
        </h3>

        <ul className="space-y-3 text-gray-700 mb-6">
          <li><strong>Save Time:</strong> No more searching through endless recipe websites. Get instant recipe ideas from your ingredients.</li>
          <li><strong>Reduce Food Waste:</strong> Use up ingredients you already have instead of buying more.</li>
          <li><strong>Personalized Results:</strong> Customize recipes by cooking method (bake, grill, air fry), dietary needs (vegetarian, vegan, halal, gluten-free), and spice level.</li>
          <li><strong>Learn New Skills:</strong> Discover new cooking techniques and flavor combinations you might not have thought of.</li>
          <li><strong>Meal Planning Made Easy:</strong> Generate multiple recipe ideas for the week ahead.</li>
        </ul>

        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          Features of Our Free AI Recipe Maker
        </h3>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-emerald-50 p-4 rounded-lg">
            <h4 className="font-bold text-gray-900 mb-2">🍳 Cooking Method Selection</h4>
            <p className="text-sm text-gray-700">Choose from bake, grill, air fry, BBQ, or any method to match your kitchen equipment.</p>
          </div>

          <div className="bg-emerald-50 p-4 rounded-lg">
            <h4 className="font-bold text-gray-900 mb-2">👥 Portion Control</h4>
            <p className="text-sm text-gray-700">Adjust serving sizes for solo cooking or family meals.</p>
          </div>

          <div className="bg-emerald-50 p-4 rounded-lg">
            <h4 className="font-bold text-gray-900 mb-2">🌶️ Spice Level</h4>
            <p className="text-sm text-gray-700">Select mild, medium, or hot to match your taste preferences.</p>
          </div>

          <div className="bg-emerald-50 p-4 rounded-lg">
            <h4 className="font-bold text-gray-900 mb-2">🥗 Dietary Requirements</h4>
            <p className="text-sm text-gray-700">Filter for vegetarian, vegan, halal, or gluten-free options.</p>
          </div>

          <div className="bg-emerald-50 p-4 rounded-lg">
            <h4 className="font-bold text-gray-900 mb-2">🚫 Ingredient Exclusions</h4>
            <p className="text-sm text-gray-700">Avoid allergens or ingredients you don't like.</p>
          </div>

          <div className="bg-emerald-50 p-4 rounded-lg">
            <h4 className="font-bold text-gray-900 mb-2">📊 Nutrition Info</h4>
            <p className="text-sm text-gray-700">Get calorie counts and macro breakdowns for each recipe.</p>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          AI Recipe Generator vs Traditional Recipe Search
        </h3>

        <p className="text-gray-700 mb-6">
          Traditional recipe websites require you to browse through countless options, read lengthy blog posts, and hope you find something that matches your ingredients. Our AI recipe generator creates custom recipes on demand, perfectly tailored to what you have and what you want.
        </p>

        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          Popular AI Recipe Ideas
        </h3>

        <p className="text-gray-700 mb-4">
          Our AI recipe maker can create recipes for any cuisine or meal type:
        </p>

        <ul className="grid md:grid-cols-2 gap-2 text-gray-700 mb-6">
          <li>✓ Quick weeknight dinners</li>
          <li>✓ Healthy lunch ideas</li>
          <li>✓ Budget-friendly meals</li>
          <li>✓ Kid-friendly recipes</li>
          <li>✓ One-pot meals</li>
          <li>✓ Air fryer recipes</li>
          <li>✓ Meal prep ideas</li>
          <li>✓ Leftover makeovers</li>
        </ul>

        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          Get Started with AI-Powered Cooking
        </h3>

        <p className="text-gray-700 mb-6">
          Ready to revolutionize your cooking? Create a free account, enter your ingredients, and let our AI recipe generator create amazing meal ideas for you. Get 1 free recipe per day, or upgrade to Premium for unlimited generations.
        </p>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <p className="text-sm text-blue-900">
            <strong>Pro Tip:</strong> For the best results, be specific with your ingredients (e.g., "chicken breast" instead of just "chicken") and don't forget to set your preferences before generating!
          </p>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          More Than Just AI Recipes
        </h3>

        <p className="text-gray-700 mb-4">
          While our AI recipe generator is perfect for creating new meal ideas, we also have a huge collection of tested UK restaurant copycat recipes. Browse recipes from your favorite brands like:
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          <Link href="/recipes?brand=greggs" className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-sm">
            Greggs
          </Link>
          <Link href="/recipes?brand=nandos" className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-sm">
            Nando's
          </Link>
          <Link href="/recipes?brand=wagamama" className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-sm">
            Wagamama
          </Link>
          <Link href="/recipes?brand=mcdonalds" className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-sm">
            McDonald's
          </Link>
          <Link href="/recipes?brand=kfc" className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-sm">
            KFC
          </Link>
          <Link href="/recipes" className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-full text-sm">
            View All Recipes →
          </Link>
        </div>
      </section>

      {/* FAQ Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Is the AI recipe generator free?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes! Create a free account and get 1 AI-generated recipe per day. Premium users get unlimited recipe generation."
                }
              },
              {
                "@type": "Question",
                "name": "How does the AI recipe generator work?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Simply enter your ingredients or recipe idea, select your preferences (cooking method, dietary needs, spice level), and our AI will create a custom recipe in seconds. The AI considers all your preferences to generate personalized meal ideas."
                }
              },
              {
                "@type": "Question",
                "name": "Can I customize the AI-generated recipes?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes! You can customize by cooking method (bake, grill, air fry, BBQ), portion size, spice level (mild, medium, hot), dietary requirements (vegetarian, vegan, halal, gluten-free), and ingredients to avoid."
                }
              },
              {
                "@type": "Question",
                "name": "What information does the AI recipe generator provide?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Each AI-generated recipe includes: ingredients with measurements, step-by-step cooking instructions, prep time, cook time, serving size, nutrition information (calories, protein, fat, carbs), cooking tips, and FAQs."
                }
              },
              {
                "@type": "Question",
                "name": "Can I save AI-generated recipes?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes! Create a free account to save your AI-generated recipes, share them with friends, and access them anytime from your recipe collection."
                }
              }
            ]
          }),
        }}
      />

      {/* WebPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Free AI Recipe Generator - Create Custom Recipes Instantly",
            "description": "Turn any ingredients into delicious recipes with our free AI recipe generator. Get personalized meal ideas in seconds.",
            "url": "https://bitebuddy.co.uk/ai-recipe-generator",
            "provider": {
              "@type": "Organization",
              "name": "Bite Buddy"
            }
          }),
        }}
      />
    </main>
  );
}
