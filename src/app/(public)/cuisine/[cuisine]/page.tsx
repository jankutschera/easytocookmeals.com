import Link from "next/link";
import { Metadata } from "next";
import { getAllRecipes } from "@/lib/recipes";
import { RecipePreviewCard } from "@/components/RecipePreviewCard";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

interface PageProps {
  params: Promise<{ cuisine: string }>;
}

export async function generateStaticParams() {
  const recipes = await getAllRecipes();
  const cuisines = Array.from(
    new Set(recipes.flatMap((r) => r.cuisine || []))
  );

  return cuisines.map((cuisine) => ({
    cuisine: cuisine.toLowerCase().replace(/\s+/g, '-'),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { cuisine } = await params;
  const displayName = cuisine
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `${displayName} Vegan Recipes | Easy to Cook Meals`,
    description: `Explore our collection of delicious ${displayName.toLowerCase()} vegan recipes. Each dish is crafted with love and inspired by authentic flavors.`,
    openGraph: {
      title: `${displayName} Vegan Recipes`,
      description: `Discover plant-based ${displayName.toLowerCase()} recipes perfect for any occasion.`,
    },
  };
}

export default async function CuisinePage({ params }: PageProps) {
  const { cuisine } = await params;
  const displayName = cuisine
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const allRecipes = await getAllRecipes();

  // Filter recipes by cuisine (case-insensitive match)
  const filteredRecipes = allRecipes.filter((recipe) =>
    recipe.cuisine?.some(
      (c) => c.toLowerCase().replace(/\s+/g, '-') === cuisine.toLowerCase()
    )
  );

  // Get all cuisines for the filter badges
  const allCuisines = Array.from(
    new Set(allRecipes.flatMap((r) => r.cuisine || []))
  ).sort();

  // Get location for handwritten label
  const locationMap: Record<string, string> = {
    israeli: 'Tel Aviv',
    'middle-eastern': 'Jerusalem',
    mediterranean: 'Tel Aviv',
    thai: 'Bangkok',
    italian: 'Roma',
    mexican: 'Mexico City',
    indian: 'Mumbai',
    japanese: 'Tokyo',
    vegan: 'Worldwide',
    american: 'California',
  };
  const location = locationMap[cuisine.toLowerCase()] || displayName;

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
                From {location}
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-normal text-ink leading-[1.05] mb-6">
              {displayName} Recipes
            </h1>

            <p className="text-xl md:text-2xl text-ink-light leading-relaxed font-body">
              Discover our collection of authentic {displayName.toLowerCase()} vegan dishes,
              each crafted with love and traditional flavors.
            </p>
          </div>
        </div>

        {/* Decorative warm elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-terracotta-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-sage-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </section>

      {/* Breadcrumb & Recipe Count */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Breadcrumb */}
          <nav className="text-sm text-ink-muted flex items-center gap-2 font-body">
            <Link href="/" className="hover:text-terracotta-600 transition-colors">
              Home
            </Link>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/recipes" className="hover:text-terracotta-600 transition-colors">
              Recipes
            </Link>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-ink font-medium">{displayName}</span>
          </nav>

          <p className="text-lg text-ink-light font-body">
            <span className="font-display text-2xl text-terracotta-600 font-medium">{filteredRecipes.length}</span>{' '}
            {filteredRecipes.length === 1 ? 'recipe' : 'recipes'}
          </p>
        </div>
      </section>

      {/* Cuisine Filter Badges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-ink-muted font-body">Browse cuisines:</span>
          <Link
            href="/recipes"
            className="px-3 py-1 bg-white text-ink-muted text-sm font-body rounded-organic border border-sand-200 hover:border-terracotta-300 hover:text-terracotta-600 transition-colors"
          >
            All
          </Link>
          {allCuisines.map((c) => {
            const slug = c.toLowerCase().replace(/\s+/g, '-');
            const isActive = slug === cuisine.toLowerCase();
            return (
              <Link
                key={c}
                href={`/cuisine/${slug}`}
                className={`px-3 py-1 text-sm font-body rounded-organic border transition-colors ${
                  isActive
                    ? 'bg-terracotta-500 text-white border-terracotta-500'
                    : 'bg-white text-ink-muted border-sand-200 hover:border-terracotta-300 hover:text-terracotta-600'
                }`}
              >
                {c}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Recipe Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {filteredRecipes.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRecipes.map((recipe, index) => (
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
            <h2 className="text-2xl font-display text-ink mb-4">No {displayName} recipes yet</h2>
            <p className="text-ink-light mb-6 font-body text-lg">
              We're always adding new recipes. Check back soon!
            </p>
            <Link
              href="/recipes"
              className="inline-flex items-center gap-2 text-terracotta-600 hover:text-terracotta-700 font-display text-lg hover:underline"
            >
              <span>View all recipes</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        )}
      </main>

      {/* Shared Footer */}
      <Footer />
    </div>
  );
}
