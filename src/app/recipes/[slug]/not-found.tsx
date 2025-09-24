import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold">Recipe not found</h1>
      <p className="mt-2 text-gray-600">That recipe doesn’t exist.</p>
      <Link href="/recipes" className="mt-4 inline-block text-emerald-700 underline">
        Go to all recipes
      </Link>
    </main>
  );
}
