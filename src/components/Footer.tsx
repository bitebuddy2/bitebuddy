export default function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-8 text-sm text-gray-600 sm:flex-row">
        <p>© {new Date().getFullYear()} Bite Buddy — UK Copycat Recipes</p>
        <p className="opacity-70">Made with Next.js + Sanity.</p>
      </div>
    </footer>
  );
}
