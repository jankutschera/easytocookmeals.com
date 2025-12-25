import type { RecipeWithRelations } from '@/types/recipe';

interface RecipeJsonLdProps {
  recipe: RecipeWithRelations;
  url: string;
}

export function RecipeJsonLd({ recipe, url }: RecipeJsonLdProps) {
  const totalTime =
    (recipe.prep_time_minutes || 0) +
    (recipe.cook_time_minutes || 0) +
    (recipe.rest_time_minutes || 0);

  // Collect all ingredients as strings for schema
  const ingredients = recipe.ingredient_groups.flatMap((group) =>
    (group.ingredients || []).map((ing) => {
      let str = '';
      if (ing.amount) str += ing.amount + ' ';
      if (ing.unit) str += ing.unit + ' ';
      str += ing.name;
      if (ing.notes) str += ` (${ing.notes})`;
      return str.trim();
    })
  );

  // Format instructions for schema
  const instructions = recipe.instructions.map((inst) => ({
    '@type': 'HowToStep',
    name: `Step ${inst.step_number}`,
    text: inst.text,
    ...(inst.image_url && { image: inst.image_url }),
  }));

  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Recipe',
    name: recipe.title,
    description: recipe.description,
    image: recipe.featured_image_url
      ? [recipe.featured_image_url, recipe.pinterest_image_url].filter(Boolean)
      : undefined,
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
    keywords: recipe.keywords?.join(', '),
    recipeIngredient: ingredients,
    recipeInstructions: instructions,
    nutrition: recipe.nutrition
      ? {
          '@type': 'NutritionInformation',
          servingSize: recipe.nutrition.serving_size,
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
    aggregateRating:
      recipe.rating_count && recipe.rating_count > 0
        ? {
            '@type': 'AggregateRating',
            ratingValue: recipe.average_rating?.toFixed(1),
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
