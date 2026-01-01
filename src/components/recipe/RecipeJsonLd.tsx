import type { RecipeWithRelations } from '@/types/recipe';

interface RecipeJsonLdProps {
  recipe: RecipeWithRelations;
  url: string;
}

// Convert relative URLs to absolute URLs for structured data
function toAbsoluteUrl(path: string | null | undefined, baseUrl: string): string | undefined {
  if (!path) return undefined;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  // Extract origin from the full URL
  const origin = new URL(baseUrl).origin;
  return `${origin}${path.startsWith('/') ? '' : '/'}${path}`;
}

export function RecipeJsonLd({ recipe, url }: RecipeJsonLdProps) {
  const totalTime =
    (recipe.prep_time_minutes || 0) +
    (recipe.cook_time_minutes || 0) +
    (recipe.rest_time_minutes || 0);

  // Collect all ingredients as strings for schema
  // Filter out empty/too short strings (Google requires 1-500 chars)
  const ingredients = recipe.ingredient_groups.flatMap((group) =>
    (group.ingredients || []).map((ing) => {
      let str = '';
      if (ing.amount) str += ing.amount + ' ';
      if (ing.unit) str += ing.unit + ' ';
      str += ing.name;
      if (ing.notes) str += ` (${ing.notes})`;
      return str.trim();
    })
  ).filter((ing) => ing.length >= 1 && ing.length <= 500);

  // Format instructions for schema
  // Add image fallback to featured image if no step image
  const instructions = recipe.instructions.map((inst) => ({
    '@type': 'HowToStep',
    name: `Step ${inst.step_number}`,
    text: inst.text,
    // Use step image if available, otherwise use featured image (absolute URLs required)
    image: toAbsoluteUrl(inst.image_url || recipe.featured_image_url, url),
  }));

  // Build keywords - combine explicit keywords with cuisine/course for better SEO
  const keywordParts: string[] = [];
  if (recipe.keywords && recipe.keywords.length > 0) {
    keywordParts.push(...recipe.keywords);
  }
  if (recipe.cuisine && recipe.cuisine.length > 0) {
    keywordParts.push(...recipe.cuisine);
  }
  if (recipe.course && recipe.course.length > 0) {
    keywordParts.push(...recipe.course);
  }
  // Add default keywords if none exist
  if (keywordParts.length === 0) {
    keywordParts.push('vegan', 'recipe', 'easy');
  }
  const keywords = [...new Set(keywordParts)].join(', ');

  // Build absolute image URLs for structured data
  const imageUrls = [
    toAbsoluteUrl(recipe.featured_image_url, url),
    toAbsoluteUrl(recipe.pinterest_image_url, url),
  ].filter(Boolean);

  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Recipe',
    name: recipe.title,
    description: recipe.description || `Easy vegan ${recipe.title} recipe`,
    image: imageUrls.length > 0 ? imageUrls : undefined,
    author: {
      '@type': 'Person',
      name: 'Easy To Cook Meals',
      url: 'https://easytocookmeals.com/about',
    },
    datePublished: recipe.published_at,
    dateModified: recipe.updated_at,
    prepTime: recipe.prep_time_minutes
      ? `PT${recipe.prep_time_minutes}M`
      : undefined,
    cookTime: recipe.cook_time_minutes
      ? `PT${recipe.cook_time_minutes}M`
      : undefined,
    totalTime: totalTime > 0 ? `PT${totalTime}M` : undefined,
    recipeYield: recipe.servings
      ? `${recipe.servings} ${recipe.servings_unit || 'servings'}`
      : undefined,
    recipeCategory: recipe.course,
    recipeCuisine: recipe.cuisine,
    keywords: keywords,
    recipeIngredient: ingredients,
    recipeInstructions: instructions,
    nutrition: recipe.nutrition
      ? {
          '@type': 'NutritionInformation',
          servingSize: recipe.nutrition.serving_size || undefined,
          calories: recipe.nutrition.calories
            ? `${recipe.nutrition.calories} calories`
            : undefined,
          carbohydrateContent: recipe.nutrition.carbs_g
            ? `${recipe.nutrition.carbs_g} g`
            : undefined,
          proteinContent: recipe.nutrition.protein_g
            ? `${recipe.nutrition.protein_g} g`
            : undefined,
          fatContent: recipe.nutrition.fat_g
            ? `${recipe.nutrition.fat_g} g`
            : undefined,
          saturatedFatContent: recipe.nutrition.saturated_fat_g
            ? `${recipe.nutrition.saturated_fat_g} g`
            : undefined,
          fiberContent: recipe.nutrition.fiber_g
            ? `${recipe.nutrition.fiber_g} g`
            : undefined,
          sugarContent: recipe.nutrition.sugar_g
            ? `${recipe.nutrition.sugar_g} g`
            : undefined,
          sodiumContent: recipe.nutrition.sodium_mg
            ? `${recipe.nutrition.sodium_mg} mg`
            : undefined,
        }
      : undefined,
    // Only include aggregateRating if we have BOTH ratingValue AND ratingCount
    // This is required by Google's structured data guidelines
    aggregateRating:
      recipe.rating_count && recipe.rating_count > 0 && recipe.average_rating
        ? {
            '@type': 'AggregateRating',
            ratingValue: Number(recipe.average_rating.toFixed(1)),
            ratingCount: recipe.rating_count,
            bestRating: 5,
            worstRating: 1,
          }
        : undefined,
    url,
  };

  // Remove undefined values for cleaner JSON
  const cleanJsonLd = JSON.parse(
    JSON.stringify(jsonLd, (_, v) => (v === undefined ? undefined : v))
  );

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(cleanJsonLd, null, 2) }}
    />
  );
}
