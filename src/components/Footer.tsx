import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* About Section */}
          <div>
            <Link href="/about">
              <h3 className="font-semibold text-gray-900 mb-3 hover:text-emerald-600 cursor-pointer">About Us</h3>
            </Link>
            <p className="text-sm text-gray-600">
              Bite Buddy brings you authentic copycat recipes from your favourite UK restaurants, delivered right to your kitchen.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-emerald-600 hover:underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/work-with-us" className="text-gray-600 hover:text-emerald-600 hover:underline">
                  Work With Us
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-emerald-600 hover:underline">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-emerald-600 hover:underline">
                  EU Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Contact</h3>
            <a
              href="mailto:hello@bitebuddy.co.uk"
              className="text-sm text-gray-600 hover:text-emerald-600 hover:underline"
            >
              hello@bitebuddy.co.uk
            </a>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 text-center text-sm text-gray-600">
          <p className="mb-2">Affiliate Disclosure: BiteBuddy may earn a small commission from qualifying purchases made through our links. This comes at no extra cost to you and helps keep our recipes free and ad-light.</p>
          <p>© {new Date().getFullYear()} Bite Buddy — UK Copycat Recipes</p>
        </div>
      </div>
    </footer>
  );
}
