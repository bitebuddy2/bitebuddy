import Link from "next/link";
import Image from "next/image";

export default function ProductsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Products</h1>
        <p className="mt-2 text-gray-600">
          Discover recommended kitchen tools, ingredients, and cookbooks to help you recreate your favourite recipes.
        </p>
      </header>

      <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder product cards - can be populated from Sanity later */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="mb-4 h-48 rounded bg-gray-100 flex items-center justify-center overflow-hidden">
            <Image
              src="/Coming soon.png"
              alt="Kitchen Essentials - Coming Soon"
              width={400}
              height={192}
              className="object-contain w-full h-full"
            />
          </div>
          <h3 className="text-lg font-semibold">Kitchen Essentials</h3>
          <p className="mt-2 text-sm text-gray-600">
            Must-have tools for recreating restaurant-quality dishes at home.
          </p>
          <Link
            href="#"
            className="mt-4 inline-block text-sm font-medium text-emerald-600 hover:text-emerald-700"
          >
            Learn More →
          </Link>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="mb-4 h-48 rounded bg-gray-100 flex items-center justify-center overflow-hidden">
            <Image
              src="/Coming soon.png"
              alt="Specialty Ingredients - Coming Soon"
              width={400}
              height={192}
              className="object-contain w-full h-full"
            />
          </div>
          <h3 className="text-lg font-semibold">Specialty Ingredients</h3>
          <p className="mt-2 text-sm text-gray-600">
            Hard-to-find ingredients that make all the difference in copycat recipes.
          </p>
          <Link
            href="#"
            className="mt-4 inline-block text-sm font-medium text-emerald-600 hover:text-emerald-700"
          >
            Learn More →
          </Link>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="mb-4 h-48 rounded bg-gray-100 flex items-center justify-center overflow-hidden">
            <Image
              src="/Coming soon.png"
              alt="Cookbooks - Coming Soon"
              width={400}
              height={192}
              className="object-contain w-full h-full"
            />
          </div>
          <h3 className="text-lg font-semibold">Cookbooks</h3>
          <p className="mt-2 text-sm text-gray-600">
            Curated collection of cookbooks for UK restaurant-style cooking.
          </p>
          <Link
            href="#"
            className="mt-4 inline-block text-sm font-medium text-emerald-600 hover:text-emerald-700"
          >
            Learn More →
          </Link>
        </div>
      </section>

      <section className="mt-12 rounded-lg bg-emerald-50 p-8 text-center">
        <h2 className="text-2xl font-semibold">Coming Soon</h2>
        <p className="mt-2 text-gray-700">
          We&apos;re curating the best products to help you succeed with copycat recipes. Check back soon!
        </p>
      </section>

    </main>
  );
}
