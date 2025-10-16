import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 py-10 sm:py-12">
        <div className="grid gap-8 sm:gap-10 md:grid-cols-3">
          {/* About Section */}
          <div>
            <Link href="/about">
              <h3 className="font-semibold text-base sm:text-lg text-gray-900 mb-4 hover:text-emerald-600 cursor-pointer">About Us</h3>
            </Link>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Bite Buddy brings you authentic copycat recipes from your favourite UK restaurants, delivered right to your kitchen.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-base sm:text-lg text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-3 text-sm sm:text-base">
              <li>
                <Link href="/features" className="text-gray-600 hover:text-emerald-600 hover:underline active:text-emerald-700">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-emerald-600 hover:underline active:text-emerald-700">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/work-with-us" className="text-gray-600 hover:text-emerald-600 hover:underline active:text-emerald-700">
                  Work With Us
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-emerald-600 hover:underline active:text-emerald-700">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-emerald-600 hover:underline active:text-emerald-700">
                  EU Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-base sm:text-lg text-gray-900 mb-4">Contact</h3>
            <a
              href="mailto:hello@bitebuddy.co.uk"
              className="text-sm sm:text-base text-gray-600 hover:text-emerald-600 hover:underline active:text-emerald-700"
            >
              hello@bitebuddy.co.uk
            </a>
          </div>
        </div>

        <div className="mt-10 sm:mt-12 border-t pt-8 text-center text-sm sm:text-base text-gray-600">
          <p className="mb-3 leading-relaxed">Affiliate Disclosure: BiteBuddy may earn a small commission from qualifying purchases made through our links. This comes at no extra cost to you and helps keep our recipes free and ad-light.</p>
          <p>© {new Date().getFullYear()} Bite Buddy — UK Copycat Recipes</p>
        </div>
      </div>
    </footer>
  );
}
