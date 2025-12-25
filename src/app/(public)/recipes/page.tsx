import Link from "next/link";
import { getAllRecipes } from "@/lib/recipes";
import { RecipePreviewCard } from "@/components/RecipePreviewCard";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const revalidate = 60;

export default async function RecipesPage() {
  const recipes = await getAllRecipes();

  // Group recipes by cuisine for optional filtering display
  const cuisines = Array.from(
    new Set(recipes.flatMap((r) => r.cuisine || []))
  ).sort();

  return (
    <div className="min-h-screen bg-parchment grain-texture">
      {/* Shared Header with Logo */}
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sand-50 via-parchment to-terracotta-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Signature handwritten accent */}
            <div className="mb-6">
              <span className="handwritten-label inline-block px-6 py-2 bg-white/60 backdrop-blur-sm rounded-organic shadow-warm-sm">
                Plant-Based Kitchen
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-normal text-ink leading-[1.05] mb-6">
              All Recipes
            </h1>

            <p className="text-xl md:text-2xl text-ink-light leading-relaxed font-body">
              Browse our complete collection of vegan recipes, each crafted with love and inspired by travels across the Mediterranean and beyond.
            </p>
          </div>
        </div>

        {/* Decorative warm elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-terracotta-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-sage-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </section>

      {/* Recipe Count & Filter Info */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-lg text-ink-light font-body">
              <span className="font-display text-2xl text-terracotta-600 font-medium">{recipes.length}</span> {recipes.length === 1 ? 'recipe' : 'recipes'} available
            </p>
          </div>

          {/* Cuisine filter badges */}
          {cuisines.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-ink-muted font-body">Browse by cuisine:</span>
              {cuisines.slice(0, 5).map((cuisine) => (
                <Link
                  key={cuisine}
                  href={`/cuisine/${cuisine.toLowerCase().replace(/\s+/g, '-')}`}
                  className="px-3 py-1 bg-white text-ink-muted text-sm font-body rounded-organic border border-sand-200 hover:border-terracotta-300 hover:text-terracotta-600 transition-colors"
                >
                  {cuisine}
                </Link>
              ))}
              {cuisines.length > 5 && (
                <span className="px-3 py-1 bg-sand-50 text-ink-muted text-sm font-body rounded-organic border border-sand-200">
                  +{cuisines.length - 5} more
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Recipe Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {recipes.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map((recipe, index) => (
              <div
                key={recipe.id}
                className="animate-fade-in-up"
                style={{
                  animationDelay: `${Math.min(index * 50, 600)}ms`,
                  animationFillMode: 'backwards'
                }}
              >
                <RecipePreviewCard recipe={recipe} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-organic border-2 border-sand-200 shadow-warm">
            <span className="text-7xl mb-6 block">🍽️</span>
            <h2 className="text-2xl font-display text-ink mb-4">No recipes yet</h2>
            <p className="text-ink-light mb-6 font-body text-lg">
              Check back soon for delicious plant-based recipes!
            </p>
            <Link
              href="/admin"
              className="inline-block text-terracotta-600 hover:text-terracotta-700 font-display text-lg hover:underline"
            >
              Go to admin to add recipes
            </Link>
          </div>
        )}
      </main>

      {/* Newsletter CTA */}
      <section className="bg-ink py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="handwritten-label mb-6 block text-terracotta-400">
            Stay Inspired
          </span>
          <h2 className="text-3xl md:text-4xl font-display text-parchment mb-4">
            New Recipes Weekly
          </h2>
          <p className="text-lg text-sand-200 mb-8 max-w-2xl mx-auto font-body">
            Get fresh recipe ideas, cooking tips, and stories from the road delivered to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-6 py-3 rounded-organic border-2 border-sand-300 focus:border-terracotta-500 focus:outline-none font-body text-ink"
            />
            <button
              type="submit"
              className="px-8 py-3 bg-terracotta-500 hover:bg-terracotta-600 text-white font-display rounded-organic transition-all duration-300 hover:shadow-warm-lg hover:scale-105"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Shared Footer */}
      <Footer />
    </div>
  );
}
