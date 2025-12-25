/**
 * Generate blogger-style food images using fal.ai
 * Style: iPhone photography, natural lighting, real kitchen setting
 * NOT professional studio photography
 */

interface RecipeForImage {
  title: string;
  cuisine?: string[];
  ingredientGroups?: {
    ingredients: { name: string }[];
  }[];
}

const BLOGGER_STYLE_PROMPT = `
[Style]: Casual food blog photography, shot on iPhone 14 Pro, natural daylight from window
[Setting]: Real home kitchen, rustic wooden table or marble countertop, lived-in feel
[Lighting]: Soft natural side lighting, gentle shadows, warm color temperature
[Composition]: Slightly overhead angle (45-60 degrees), artfully messy styling, fresh herbs scattered
[Props]: Vintage ceramic plates, linen napkins, wooden cutting board, copper utensils in background
[Mood]: Cozy, inviting, homemade, imperfect but beautiful
[Quality]: High resolution, shallow depth of field on edges, Instagram-worthy
`;

/**
 * Generate a food image for the recipe using fal.ai FLUX.2
 */
export async function generateRecipeImage(recipe: RecipeForImage): Promise<string> {
  const FAL_API_KEY = process.env.FAL_API_KEY;

  if (!FAL_API_KEY) {
    console.warn('FAL_API_KEY not set, skipping image generation');
    return '';
  }

  // Build descriptive prompt from recipe
  const mainIngredients = recipe.ingredientGroups
    ?.flatMap((g) => g.ingredients.slice(0, 3))
    .map((i) => i.name)
    .slice(0, 5)
    .join(', ') || 'plant-based ingredients';

  const cuisineContext = recipe.cuisine?.join(' and ') || 'international';

  const imagePrompt = `
A beautiful ${cuisineContext} vegan dish: ${recipe.title}.
Main visible ingredients: ${mainIngredients}.
${BLOGGER_STYLE_PROMPT}
The food looks freshly made, steam rising gently, garnished with fresh herbs.
No text, no watermarks, no logos.
`.trim();

  try {
    const response = await fetch('https://fal.run/fal-ai/flux-2-pro', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${FAL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: imagePrompt,
        image_size: 'landscape_16_9',
        num_images: 1,
        enable_safety_checker: true,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`FAL API error: ${error}`);
    }

    const result = await response.json();
    return result.images?.[0]?.url || '';
  } catch (error) {
    console.error('Image generation error:', error);
    return '';
  }
}

/**
 * Generate a Pinterest-optimized image (2:3 ratio)
 */
export async function generatePinterestImage(recipe: RecipeForImage): Promise<string> {
  const FAL_API_KEY = process.env.FAL_API_KEY;

  if (!FAL_API_KEY) {
    return '';
  }

  const mainIngredients = recipe.ingredientGroups
    ?.flatMap((g) => g.ingredients.slice(0, 3))
    .map((i) => i.name)
    .slice(0, 5)
    .join(', ') || 'plant-based ingredients';

  const imagePrompt = `
Top-down flat lay food photography of ${recipe.title}.
Ingredients artfully arranged: ${mainIngredients}.
${BLOGGER_STYLE_PROMPT}
Vertical composition, Pinterest-optimized, extra space at top for text overlay.
Bright, airy, clean aesthetic with pops of color from fresh vegetables.
`.trim();

  try {
    const response = await fetch('https://fal.run/fal-ai/flux-2-pro', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${FAL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: imagePrompt,
        image_size: 'portrait_4_3',
        num_images: 1,
        enable_safety_checker: true,
      }),
    });

    if (!response.ok) {
      return '';
    }

    const result = await response.json();
    return result.images?.[0]?.url || '';
  } catch (error) {
    console.error('Pinterest image generation error:', error);
    return '';
  }
}
