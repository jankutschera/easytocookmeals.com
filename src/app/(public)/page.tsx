import Link from "next/link";
import Image from "next/image";
import { getAllRecipes } from "@/lib/recipes";
import { RecipePreviewCard } from "@/components/RecipePreviewCard";
import { getRecipeImage } from "@/lib/recipe-images";
import { WebsiteStructuredData } from "@/components/StructuredData";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { NewsletterForm } from "@/components/newsletter/NewsletterForm";
import { InstagramFeed } from "@/components/instagram/InstagramFeed";

export const revalidate = 60;

export default async function HomePage() {
  const recipes = await getAllRecipes();
  const featuredRecipe = recipes[0];
  const recentRecipes = recipes.slice(1, 10); // Show 9 recipes instead of 6

  const cuisineGroups = recipes.reduce((acc, recipe) => {
    const cuisine = recipe.cuisine?.[0] || 'Other';
    if (!acc[cuisine]) acc[cuisine] = [];
    acc[cuisine].push(recipe);
    return acc;
  }, {} as Record<string, typeof recipes>);

  return (
    <div className="min-h-screen bg-parchment grain-texture">
      <WebsiteStructuredData />

      {/* Shared Header with Logo */}
      <Header />

      {/* Hero Section - ASYMMETRIC layout (NOT centered) per TrueBrew Design System */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sand-50 via-parchment to-terracotta-50 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Asymmetric grid - content left-aligned */}
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              {/* Signature handwritten accent */}
              <div className="mb-6">
                <span className="handwritten-label inline-block px-6 py-2 bg-white/60 backdrop-blur-sm rounded-organic shadow-warm-sm">
                  From Tel Aviv Markets ✨
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-normal text-ink leading-[1.05] mb-8">
                Every Recipe<br />
                Tells a Story
              </h1>

              <p className="text-xl md:text-2xl text-ink-light leading-relaxed mb-10 max-w-2xl font-body">
                Authentic vegan recipes from Sandra & Jan—a couple who met in Berlin, now cooking from Cyprus while exploring the world. Each dish carries the warmth of our travels and the comfort of home.
              </p>

              <div className="flex flex-col sm:flex-row gap-5">
                <Link
                  href="#recipes"
                  className="btn-primary group inline-flex items-center gap-3"
                >
                  <span>Explore Recipes</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="#newsletter"
                  className="btn-secondary inline-flex items-center gap-3"
                >
                  <span>Weekly Inspiration</span>
                </Link>
              </div>
            </div>

            {/* Visual element on the right - recipe image collage */}
            <div className="lg:col-span-5 hidden lg:block">
              <div className="relative">
                {/* Stacked recipe image collage */}
                <div className="relative w-full aspect-square">
                  {/* Main large image */}
                  {recipes[0] && (() => {
                    const img = getRecipeImage(recipes[0].slug, recipes[0].featured_image_url);
                    return img ? (
                      <div className="absolute inset-4 rounded-organic overflow-hidden shadow-warm-xl rotate-2 hover:rotate-0 transition-transform duration-500">
                        <Image
                          src={img}
                          alt={recipes[0].title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 0vw, 40vw"
                        />
                      </div>
                    ) : null;
                  })()}

                  {/* Smaller overlapping image - top left */}
                  {recipes[1] && (() => {
                    const img = getRecipeImage(recipes[1].slug, recipes[1].featured_image_url);
                    return img ? (
                      <div className="absolute -top-4 -left-4 w-32 h-32 rounded-organic overflow-hidden shadow-warm-lg -rotate-6 hover:rotate-0 transition-transform duration-500 border-4 border-white z-10">
                        <Image
                          src={img}
                          alt={recipes[1].title}
                          fill
                          className="object-cover"
                          sizes="128px"
                        />
                      </div>
                    ) : null;
                  })()}

                  {/* Smaller overlapping image - bottom right */}
                  {recipes[2] && (() => {
                    const img = getRecipeImage(recipes[2].slug, recipes[2].featured_image_url);
                    return img ? (
                      <div className="absolute -bottom-4 -right-4 w-40 h-40 rounded-organic overflow-hidden shadow-warm-lg rotate-6 hover:rotate-0 transition-transform duration-500 border-4 border-white z-10">
                        <Image
                          src={img}
                          alt={recipes[2].title}
                          fill
                          className="object-cover"
                          sizes="160px"
                        />
                      </div>
                    ) : null;
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative warm elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-terracotta-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-sage-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </section>

      {/* Featured Recipe - Large hero card with warm glow */}
      {featuredRecipe && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
          <div className="text-center mb-12">
            <span className="handwritten-label mb-4 block">
              Featured This Week
            </span>
            <h2 className="text-4xl md:text-5xl font-display text-ink">
              Chef's Pick
            </h2>
          </div>

          <Link
            href={`/recipe/${featuredRecipe.slug}`}
            className="group block recipe-card warm-glow"
          >
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative aspect-[4/3] md:aspect-auto overflow-hidden">
                {(() => {
                  const imageUrl = getRecipeImage(featuredRecipe.slug, featuredRecipe.featured_image_url);
                  return imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={featuredRecipe.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-terracotta-100 to-sand-200 flex items-center justify-center">
                      <span className="text-9xl">🍽️</span>
                    </div>
                  );
                })()}
              </div>
              <div className="p-10 md:p-14 flex flex-col justify-center">
                {featuredRecipe.cuisine && featuredRecipe.cuisine.length > 0 && (
                  <span className="inline-block w-fit px-4 py-2 bg-terracotta-50 text-terracotta-700 text-sm font-body font-medium rounded-organic mb-5 border border-terracotta-200">
                    {featuredRecipe.cuisine[0]}
                  </span>
                )}
                <h3 className="text-4xl md:text-5xl font-display text-ink mb-6 group-hover:text-terracotta-600 transition-colors duration-300">
                  {featuredRecipe.title}
                </h3>
                {featuredRecipe.description && (
                  <p className="text-lg text-ink-light mb-8 leading-relaxed font-body">
                    {featuredRecipe.description}
                  </p>
                )}
                <div className="flex items-center gap-8 text-ink-muted mb-8 font-body">
                  {((featuredRecipe.prep_time_minutes || 0) + (featuredRecipe.cook_time_minutes || 0) + (featuredRecipe.rest_time_minutes || 0)) > 0 && (
                    <span className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {(featuredRecipe.prep_time_minutes || 0) + (featuredRecipe.cook_time_minutes || 0) + (featuredRecipe.rest_time_minutes || 0)} min
                    </span>
                  )}
                  {featuredRecipe.servings && (
                    <span className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {featuredRecipe.servings} servings
                    </span>
                  )}
                </div>
                <span className="inline-flex items-center gap-3 text-terracotta-600 font-display text-lg group-hover:gap-4 transition-all">
                  View Recipe
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Recipe Grid - Latest recipes */}
      <section id="recipes" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24 scroll-mt-20">
        <div className="text-center mb-16">
          <span className="handwritten-label mb-4 block">
            Latest from the Kitchen
          </span>
          <h2 className="text-4xl md:text-5xl font-display text-ink mb-6">
            Recent Recipes
          </h2>
          <p className="text-xl text-ink-light max-w-2xl mx-auto font-body">
            Fresh ideas inspired by travels, traditions, and the vibrant flavors of the Mediterranean
          </p>
        </div>

        {recentRecipes.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentRecipes.map((recipe, index) => (
                <div
                  key={recipe.id}
                  className={`animate-fade-in-up stagger-${Math.min(index + 1, 6)}`}
                >
                  <RecipePreviewCard recipe={recipe} />
                </div>
              ))}
            </div>

            {/* View All Recipes Link */}
            {recipes.length > 10 && (
              <div className="text-center mt-16">
                <Link
                  href="/recipes"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-terracotta-500 hover:bg-terracotta-600 text-white font-display text-lg rounded-organic transition-all duration-300 hover:shadow-warm-lg hover:scale-105 group"
                >
                  <span>View All {recipes.length} Recipes</span>
                  <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-organic border-2 border-sand-200 shadow-warm">
            <p className="text-ink-light mb-6 font-body text-lg">No recipes published yet.</p>
            <Link
              href="/admin"
              className="inline-block text-terracotta-600 hover:text-terracotta-700 font-display text-lg hover:underline"
            >
              Go to admin to add recipes
            </Link>
          </div>
        )}
      </section>

      {/* Categories by Cuisine - Mediterranean inspired */}
      {Object.keys(cuisineGroups).length > 0 && (
        <section className="bg-sand-50 py-20 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="handwritten-label mb-4 block">
                Journey Through Flavors
              </span>
              <h2 className="text-4xl md:text-5xl font-display text-ink mb-6">
                Explore by Cuisine
              </h2>
              <p className="text-xl text-ink-light max-w-2xl mx-auto font-body">
                From Tel Aviv street food to traditional home cooking
              </p>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Object.entries(cuisineGroups).slice(0, 8).map(([cuisine, cuisineRecipes]) => (
                <Link
                  key={cuisine}
                  href={`/cuisine/${cuisine.toLowerCase()}`}
                  className="group relative overflow-hidden rounded-organic bg-white p-8 hover:shadow-warm-lg transition-all duration-300 hover:scale-105 border border-sand-200"
                >
                  <div className="relative z-10">
                    <h3 className="text-2xl font-display text-ink mb-3 group-hover:text-terracotta-600 transition-colors duration-300">
                      {cuisine}
                    </h3>
                    <p className="text-sm text-ink-muted font-body">
                      {cuisineRecipes.length} {cuisineRecipes.length === 1 ? 'recipe' : 'recipes'}
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-terracotta-500/0 to-terracotta-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About Us - Our Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
        <div className="bg-gradient-to-br from-terracotta-50 via-sand-50 to-sage-50 rounded-organic p-10 md:p-16 lg:p-20 text-center shadow-warm-lg border border-terracotta-100">
          <div className="max-w-3xl mx-auto">
            {/* Sandra & Jan - Two profile images */}
            <div className="flex justify-center gap-4 mb-8">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden shadow-warm-lg border-4 border-white bg-gradient-to-br from-terracotta-200 to-sage-200 flex items-center justify-center">
                <span className="text-4xl md:text-5xl">👩</span>
              </div>
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden shadow-warm-lg border-4 border-white bg-gradient-to-br from-sage-200 to-terracotta-200 flex items-center justify-center">
                <span className="text-4xl md:text-5xl">👨</span>
              </div>
            </div>
            <span className="handwritten-label mb-6 block">
              From Cyprus to the World
            </span>
            <h2 className="text-4xl md:text-5xl font-display text-ink mb-8 handwritten-underline inline-block">
              Sandra & Jan
            </h2>
            <p className="text-xl md:text-2xl text-ink-light leading-relaxed mb-10 font-body">
              We met in Berlin, fell in love with each other and with cooking. Now we call Cyprus home—our sunny base from which we explore the world. From the streets of Tel Aviv to the markets of Barcelona, from Brooklyn bistros to Mediterranean shores, we collect recipes, flavors, and stories to share with you.
            </p>
            <Link
              href="/about"
              className="btn-primary inline-flex items-center gap-3"
            >
              <span>Read Our Story</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter - Warm invitation */}
      <section id="newsletter" className="bg-ink py-20 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="handwritten-label mb-6 block text-terracotta-400">
            Join the Community
          </span>
          <h2 className="text-4xl md:text-5xl font-display text-parchment mb-6">
            Weekly Recipe Inspiration
          </h2>
          <p className="text-xl text-sand-200 mb-10 max-w-2xl mx-auto font-body">
            Every week, we share new recipes, travel stories, and tips for bringing global flavors into your kitchen—wherever you are.
          </p>
          <NewsletterForm />
        </div>
      </section>

      {/* Instagram Feed */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
        <div className="text-center mb-12">
          <span className="handwritten-label mb-4 block">
            Follow Our Journey
          </span>
          <h2 className="text-4xl md:text-5xl font-display text-ink mb-6">
            @janshellskitchen
          </h2>
          <p className="text-xl text-ink-light mb-8 font-body">
            Fresh from our kitchen to your feed
          </p>
        </div>

        <InstagramFeed limit={6} />

        <div className="text-center mt-10">
          <a
            href="https://www.instagram.com/janshellskitchen"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 text-white font-display text-lg rounded-organic transition-all duration-300 hover:shadow-warm-lg hover:scale-105"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/>
            </svg>
            Follow on Instagram
          </a>
        </div>
      </section>

      {/* Shared Footer */}
      <Footer />
    </div>
  );
}
