import Link from 'next/link';
import Image from 'next/image';
import type { Recipe } from '@/types/recipe';
import { getRecipeImage } from '@/lib/recipe-images';

interface RecipePreviewCardProps {
  recipe: Recipe;
}

export function RecipePreviewCard({ recipe }: RecipePreviewCardProps) {
  const totalTime =
    (recipe.prep_time_minutes || 0) +
    (recipe.cook_time_minutes || 0) +
    (recipe.rest_time_minutes || 0);

  // Get location from cuisine for handwritten label
  const getLocation = (cuisine?: string[]) => {
    if (!cuisine || cuisine.length === 0) return null;
    const locationMap: Record<string, string> = {
      'Israeli': 'Tel Aviv',
      'Middle Eastern': 'Jerusalem',
      'Mediterranean': 'Tel Aviv',
      'Thai': 'Bangkok',
      'Italian': 'Roma',
      'Mexican': 'Mexico City',
      'Indian': 'Mumbai',
      'Japanese': 'Tokyo',
    };
    return locationMap[cuisine[0]] || cuisine[0];
  };

  const location = getLocation(recipe.cuisine);

  return (
    <Link
      href={`/recipe/${recipe.slug}`}
      className="group block recipe-card"
    >
      {/* Image with Hover Reveal overlay */}
      <div className="aspect-[4/3] relative overflow-hidden bg-sand-100">
        {(() => {
          const imageUrl = getRecipeImage(recipe.slug, recipe.featured_image_url);
          return imageUrl ? (
            <Image
              src={imageUrl}
              alt={recipe.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-600"
              style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-terracotta-100 to-sand-200 flex items-center justify-center">
              <span className="text-7xl opacity-40">🍽️</span>
            </div>
          );
        })()}

        {/* SIGNATURE ELEMENT: Handwritten location label */}
        {location && (
          <div className="absolute top-4 left-4">
            <span className="handwritten-label text-lg bg-white/90 backdrop-blur-sm px-4 py-2 rounded-organic shadow-warm-sm border border-sand-200 text-terracotta-600">
              From {location}
            </span>
          </div>
        )}

        {/* Gradient overlay - Hover Reveal Pattern */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400"
             style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }} />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-display font-normal text-2xl text-ink group-hover:text-terracotta-600 transition-colors line-clamp-2 mb-3 leading-tight">
          {recipe.title}
        </h3>

        {recipe.description && (
          <p className="text-ink-light font-body text-sm line-clamp-2 leading-relaxed mb-4">
            {recipe.description}
          </p>
        )}

        {/* Meta info */}
        <div className="flex items-center gap-4 text-sm text-ink-muted font-body pb-4 border-b border-sand-200">
          {totalTime > 0 && (
            <span className="flex items-center gap-1.5">
              <svg
                className="w-4 h-4 text-terracotta-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-medium">{totalTime} min</span>
            </span>
          )}

          {recipe.servings && (
            <span className="flex items-center gap-1.5">
              <svg
                className="w-4 h-4 text-terracotta-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="font-medium">{recipe.servings} servings</span>
            </span>
          )}
        </div>

        {/* Course badges */}
        {recipe.course && recipe.course.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {recipe.course.slice(0, 2).map((c) => (
              <span
                key={c}
                className="px-3 py-1 bg-terracotta-50 text-terracotta-700 text-xs font-body font-medium rounded-organic border border-terracotta-100"
              >
                {c}
              </span>
            ))}
            {recipe.course.length > 2 && (
              <span className="px-3 py-1 bg-sand-50 text-ink-muted text-xs font-body font-medium rounded-organic border border-sand-200">
                +{recipe.course.length - 2}
              </span>
            )}
          </div>
        )}

        {/* View Recipe hint */}
        <div className="mt-4 flex items-center gap-2 text-terracotta-600 font-display font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
          <span>View Recipe</span>
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
