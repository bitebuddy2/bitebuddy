export default function WorkWithUsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-4xl font-bold tracking-tight mb-8">Work With Us</h1>

      <div className="prose prose-gray max-w-none">
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          We're always looking for partnerships that help home cooks recreate their favourite restaurant meals.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Restaurant Partnerships</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Are you a restaurant or chain interested in sharing your recipes with home cooks? We'd love to work with you to create official copycat recipes that showcase your signature dishes.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Brand Collaborations</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Food brands, ingredient suppliers, and kitchen equipment manufacturers — if your products help home cooks succeed, let's collaborate on content that showcases them in action.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Content Creators</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Are you a food blogger, recipe developer, or content creator? We're open to guest contributions and collaborative projects that bring value to our community.
        </p>

        <div className="mt-12 p-6 bg-emerald-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-3">Get In Touch</h3>
          <p className="text-gray-700 mb-4">
            Interested in working together? Drop us a line and let's discuss how we can collaborate.
          </p>
          <a
            href="mailto:hello@bitebuddy.co.uk"
            className="inline-block px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition"
          >
            Contact Us
          </a>
        </div>
      </div>
    </main>
  );
}
