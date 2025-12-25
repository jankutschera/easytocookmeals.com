/**
 * Recipe image mappings
 * Maps recipe slugs to their local image files in /public/images/recipes/
 */

export const RECIPE_IMAGES: Record<string, string> = {
  // Current 12 recipes from WordPress import
  'zucchini-carrot-crustless-pizza': '/images/recipes/zucchini-carrot-crustless-pizza/featured.jpg',
  'authentic-falafel': '/images/recipes/authentic-falafel/featured.jpeg',
  'vegan-sweet-potato-plantain-bowl': '/images/recipes/vegan-sweet-potato-plantain-bowl/featured.jpg',
  'watermelon-kiwi-smoothie': '/images/recipes/watermelon-kiwi-smoothie/featured.png',
  'tropical-coconut-chia-pudding': '/images/recipes/tropical-coconut-chia-pudding/featured.png',
  'vegan-oreos': '/images/recipes/vegan-oreos/featured.png',
  'overnight-oatmeal': '/images/recipes/overnight-oatmeal/featured.png',
  'vegan-turkey-pasta-sauce': '/images/recipes/vegan-turkey-pasta-sauce/featured.png',
  'vegan-asian-beef-broccoli': '/images/recipes/vegan-asian-beef-broccoli/featured.png',
  'vegan-raclette-cheese': '/images/recipes/vegan-raclette-cheese/featured.png',
  'vegan-mozzarella': '/images/recipes/vegan-mozzarella/featured.png',
  'dinner-rolls': '/images/recipes/dinner-rolls/featured.png',
};

/**
 * Get image path for a recipe
 * Uses local images when available, falls back to database URL
 */
export function getRecipeImage(slug: string, fallbackUrl?: string): string | undefined {
  // Try exact slug match first
  if (RECIPE_IMAGES[slug]) {
    return RECIPE_IMAGES[slug];
  }

  // Fallback to provided URL from database
  return fallbackUrl;
}

/**
 * Check if a local image exists for a recipe
 */
export function hasLocalImage(slug: string): boolean {
  return !!RECIPE_IMAGES[slug];
}
