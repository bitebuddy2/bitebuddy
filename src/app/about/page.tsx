import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Bite Buddy - UK Copycat Recipe Creator | Bite Buddy",
  description: "Meet Jonathan, the recipe creator behind Bite Buddy. Learn how we help home cooks recreate their favourite UK restaurant dishes with simple, tested recipes.",
  openGraph: {
    title: "About Bite Buddy - UK Copycat Recipe Creator | Bite Buddy",
    description: "Meet Jonathan, the recipe creator behind Bite Buddy. Learn how we help home cooks recreate their favourite UK restaurant dishes with simple, tested recipes.",
  },
  twitter: {
    title: "About Bite Buddy - UK Copycat Recipe Creator | Bite Buddy",
    description: "Meet Jonathan, the recipe creator behind Bite Buddy. Learn how we help home cooks recreate their favourite UK restaurant dishes with simple, tested recipes.",
  },
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-4xl font-bold tracking-tight mb-8">About Us</h1>

      <div className="grid gap-8 md:grid-cols-2 items-start mb-8">
        <div className="order-2 md:order-1">
          <p className="text-gray-700 leading-relaxed">
            I'm Jonathan — the recipe tinkerer behind BiteBuddy. It started at uni when my budget couldn't keep up with a Nando's habit. Saturday nights turned into "fakeaway" experiments: scribbled notes, supermarket swaps, and the occasional disaster (RIP to the laptop I once splashed with peri-peri marinade). Over time I got decent at decoding flavours, and friends kept asking for the recipes… so I built this place.
          </p>
          <p className="text-gray-700 leading-relaxed mt-4">
            BiteBuddy is for busy home kitchens: clear steps, simple ingredients you can actually find at Tesco/Asda/Ocado, and smart swaps to keep costs down. I'm always open to improvements and suggestions—if something could be clearer, cheaper, or tastier, tell me so I can make BiteBuddy more useful.
          </p>
          <p className="text-gray-700 leading-relaxed mt-4">
            If you love the taste of your favourite chains but prefer cooking at home — welcome in. Kettle on, apron on, let's cook something brilliant.
          </p>
        </div>

        <div className="order-1 md:order-2">
          <Image
            src="/my image.jpg"
            alt="Jonathan - Founder of BiteBuddy"
            width={400}
            height={400}
            className="rounded-lg shadow-lg w-full h-auto"
          />
        </div>
      </div>
    </main>
  );
}
