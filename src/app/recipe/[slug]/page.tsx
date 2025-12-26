import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getRecipeBySlug, getAllRecipeSlugs } from '@/lib/recipes';
import { getRecipeImage } from '@/lib/recipe-images';
import { getBlogContent } from '@/lib/blog-content';
import { RecipeCard } from '@/components/recipe/RecipeCard';
import { RecipeJsonLd } from '@/components/recipe/RecipeJsonLd';
import { JumpToRecipeButton } from '@/components/recipe/JumpToRecipeButton';
import { ArticleContent } from '@/components/recipe/ArticleContent';
import { RecipeActions } from '@/components/recipe/RecipeActions';
import { BackToTopButton } from '@/components/ui/BackToTopButton';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

// Revalidate every 60 seconds for fresh data from database
export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllRecipeSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);

  if (!recipe) {
    return { title: 'Recipe Not Found' };
  }

  const title = recipe.meta_title || recipe.title;
  const description =
    recipe.meta_description ||
    recipe.description ||
    `Learn how to make ${recipe.title} with this easy recipe.`;

  const imageUrl = getRecipeImage(recipe.slug, recipe.featured_image_url);

  return {
    title: `${title} | Easy To Cook Meals`,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      images: imageUrl
        ? [{ url: imageUrl, width: 1200, height: 630 }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function RecipePage({ params }: PageProps) {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);

  if (!recipe) {
    notFound();
  }

  const url = `https://easytocookmeals.com/recipe/${slug}`;
  const imageUrl = getRecipeImage(recipe.slug, recipe.featured_image_url);

  // Get full blog content if available
  const blogContent = getBlogContent(slug);

  // Calculate total time
  const totalTime =
    (recipe.prep_time_minutes || 0) +
    (recipe.cook_time_minutes || 0) +
    (recipe.rest_time_minutes || 0);

  // Get location for handwritten label
  const getLocation = (cuisine?: string[]) => {
    if (!cuisine || cuisine.length === 0) return null;
    const locationMap: Record<string, string> = {
      Israeli: 'Tel Aviv',
      'Middle Eastern': 'Jerusalem',
      Mediterranean: 'Tel Aviv',
      Thai: 'Bangkok',
      Italian: 'Roma',
      Mexican: 'Mexico City',
      Indian: 'Mumbai',
      Japanese: 'Tokyo',
      Vietnamese: 'Hanoi',
      Austrian: 'Vienna',
      Swiss: 'Zurich',
      French: 'Paris',
      African: 'West Africa',
      'West African': 'Accra',
      Vegan: 'Worldwide',
      American: 'California',
    };
    return locationMap[cuisine[0]] || cuisine[0];
  };

  const location = getLocation(recipe.cuisine);

  return (
    <>
      <RecipeJsonLd recipe={recipe} url={url} />

      <div className="min-h-screen bg-parchment grain-texture">
        {/* Header with Logo */}
        <Header />

        {/* Jump to Recipe - Sticky */}
        <div className="sticky top-[72px] z-30 bg-parchment/90 backdrop-blur-sm border-b border-sand-200/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex justify-end">
            <JumpToRecipeButton />
          </div>
        </div>

        {/* Hero Image */}
        {imageUrl && (
          <div className="relative w-full h-[50vh] md:h-[60vh] max-h-[600px] overflow-hidden">
            <Image
              src={imageUrl}
              alt={recipe.title}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

            {/* SIGNATURE ELEMENT: Handwritten location label */}
            {location && (
              <div className="absolute top-6 left-6">
                <span className="handwritten-label text-xl bg-white/90 backdrop-blur-sm px-5 py-3 rounded-organic shadow-warm border border-sand-200">
                  From {location}
                </span>
              </div>
            )}

            {/* Title overlay on image */}
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
              <div className="max-w-4xl mx-auto">
                {recipe.cuisine && recipe.cuisine.length > 0 && (
                  <span className="inline-block px-4 py-2 bg-terracotta-500/90 backdrop-blur-sm text-white text-sm font-body font-medium rounded-organic mb-4 shadow-warm-sm">
                    {recipe.cuisine[0]}
                  </span>
                )}
                <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-normal text-white leading-tight text-balance drop-shadow-lg">
                  {recipe.title}
                </h1>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          {/* Breadcrumb */}
          <nav className="text-sm text-ink-muted mb-8 flex items-center gap-2 font-body">
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
            <span className="text-ink font-medium">{recipe.title}</span>
          </nav>

          {/* Title if no hero image */}
          {!imageUrl && (
            <>
              {location && (
                <span className="handwritten-label mb-4 block">{location}</span>
              )}
              {recipe.cuisine && recipe.cuisine.length > 0 && (
                <span className="inline-block px-4 py-2 bg-terracotta-50 text-terracotta-700 text-sm font-body font-medium rounded-organic mb-6 border border-terracotta-200">
                  {recipe.cuisine[0]}
                </span>
              )}
              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-normal text-ink leading-tight mb-8 text-balance">
                {recipe.title}
              </h1>
            </>
          )}

          {/* Author Attribution */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex -space-x-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-terracotta-200 to-sage-200 flex items-center justify-center border-2 border-white text-lg">
                👩
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sage-200 to-terracotta-200 flex items-center justify-center border-2 border-white text-lg">
                👨
              </div>
            </div>
            <div className="font-body">
              <p className="text-ink font-medium">Tested by Sandra & Jan</p>
              <p className="text-ink-muted text-sm">From our kitchen in Cyprus</p>
            </div>
          </div>

          {/* Recipe Meta Info */}
          <div className="flex flex-wrap items-center gap-8 py-6 border-y border-sand-200 mb-12">
            {totalTime > 0 && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-terracotta-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-terracotta-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-ink-muted uppercase tracking-wide font-body">Total Time</p>
                  <p className="font-display font-normal text-ink text-lg">{totalTime} min</p>
                </div>
              </div>
            )}
            {recipe.servings && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-sage-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-sage-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-ink-muted uppercase tracking-wide font-body">Servings</p>
                  <p className="font-display font-normal text-ink text-lg">{recipe.servings}</p>
                </div>
              </div>
            )}
            {recipe.course && recipe.course.length > 0 && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-ochre-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-ochre-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-ink-muted uppercase tracking-wide font-body">Course</p>
                  <p className="font-display font-normal text-ink text-lg">{recipe.course.join(', ')}</p>
                </div>
              </div>
            )}
          </div>

          {/* Story section with beautiful typography */}
          {(blogContent || recipe.story) && (
            <section className="mb-16">
              {/* Blog content title */}
              {blogContent?.title && (
                <h2 className="font-display text-2xl md:text-3xl font-normal text-ink mb-8 text-center">
                  {blogContent.title}
                </h2>
              )}

              <div className="prose prose-lg md:prose-xl max-w-none prose-headings:font-display prose-headings:font-normal prose-p:font-body prose-p:text-ink-light prose-p:leading-relaxed">
                {blogContent ? (
                  // Full blog content - split into paragraphs
                  <div className="space-y-6">
                    {blogContent.content.split('\n\n').map((paragraph, index) => {
                      // Check if it's a heading
                      if (paragraph.startsWith('## ')) {
                        return (
                          <h3 key={index} className="font-display text-xl md:text-2xl font-normal text-ink mt-8 mb-4">
                            {paragraph.replace('## ', '')}
                          </h3>
                        );
                      }
                      // First paragraph gets drop cap styling
                      if (index === 0) {
                        return (
                          <p
                            key={index}
                            className="text-xl md:text-2xl text-ink-light leading-relaxed font-body first-letter:text-7xl first-letter:font-display first-letter:font-normal first-letter:text-terracotta-500 first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:mt-1"
                          >
                            {paragraph}
                          </p>
                        );
                      }
                      return (
                        <p key={index} className="text-lg md:text-xl text-ink-light leading-relaxed font-body">
                          {paragraph}
                        </p>
                      );
                    })}
                  </div>
                ) : recipe.story ? (
                  // Recipe story with full markdown support
                  <ArticleContent content={recipe.story} />
                ) : null}
              </div>

              {/* Decorative divider */}
              <div className="flex items-center justify-center my-12">
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-terracotta-300 to-transparent" />
                <span className="mx-4 text-2xl text-terracotta-300">✦</span>
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-terracotta-300 to-transparent" />
              </div>
            </section>
          )}

          {/* Recipe Card - the actual recipe content */}
          <div id="recipe-card" className="scroll-mt-32">
            <RecipeCard
              recipe={recipe}
              ingredientGroups={recipe.ingredient_groups}
              instructions={recipe.instructions}
              nutrition={recipe.nutrition || null}
              averageRating={recipe.average_rating}
              ratingCount={recipe.rating_count}
            />
          </div>

          {/* Share Section */}
          <section className="mt-12 pt-12 border-t border-sand-200">
            <div className="text-center">
              <span className="handwritten-label mb-4 block">Spread the Joy</span>
              <h3 className="font-display text-2xl md:text-3xl font-normal text-ink mb-4">
                Love this recipe?
              </h3>
              <p className="text-ink-muted mb-6 font-body">
                Share it with friends or save it for later
              </p>
              <RecipeActions
                title={recipe.title}
                url={url}
                recipeId={recipe.id}
              />
            </div>
          </section>
        </article>

        {/* Footer */}
        <Footer />

        {/* Back to Top Button */}
        <BackToTopButton />
      </div>
    </>
  );
}
