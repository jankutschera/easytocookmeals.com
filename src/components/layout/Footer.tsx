import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-ink text-sand-200 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <h3 className="text-3xl font-display text-parchment mb-6">
              Easy to Cook Meals
            </h3>
            <p className="text-sand-300 leading-relaxed max-w-md font-body text-lg">
              Plant-based recipes with heart, inspired by travels and traditions from the
              sun-soaked streets of Tel Aviv to kitchens around the world.
            </p>
          </div>
          <div>
            <h4 className="text-parchment font-display text-xl mb-6">Explore</h4>
            <ul className="space-y-3 font-body">
              <li>
                <Link href="/recipes" className="hover:text-terracotta-400 transition-colors">
                  All Recipes
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-terracotta-400 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-terracotta-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/data-deletion" className="hover:text-terracotta-400 transition-colors">
                  Data Deletion
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-parchment font-display text-xl mb-6">Connect</h4>
            <ul className="space-y-3 font-body">
              <li>
                <a
                  href="https://www.instagram.com/janshellskitchen"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-terracotta-400 transition-colors inline-flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  @janshellskitchen
                </a>
              </li>
              <li>
                <a
                  href="https://pinterest.com/easytocookmeals"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-terracotta-400 transition-colors"
                >
                  Pinterest
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-ink-light pt-10 text-center text-sm text-sand-400 font-body">
          <p>&copy; {new Date().getFullYear()} Easy to Cook Meals. All rights reserved. Made with love by Sandra & Jan.</p>
        </div>
      </div>
    </footer>
  );
}
