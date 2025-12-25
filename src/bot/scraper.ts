import { parse } from 'node-html-parser';

interface ScrapedRecipe {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  cuisine?: string;
  source: string;
  sourceUrl: string;
}

/**
 * Scrape recipe from URL
 * Supports JSON-LD schema.org/Recipe format (most recipe sites)
 */
export async function scrapeRecipe(url: string): Promise<ScrapedRecipe> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; EasyToCookMealsBot/1.0)',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${response.status}`);
  }

  const html = await response.text();
  const root = parse(html);

  // Try to find JSON-LD recipe data
  const jsonLdScripts = root.querySelectorAll('script[type="application/ld+json"]');

  for (const script of jsonLdScripts) {
    try {
      const data = JSON.parse(script.textContent);
      const recipe = findRecipeInJsonLd(data);
      if (recipe) {
        return parseJsonLdRecipe(recipe, url);
      }
    } catch (e) {
      // Continue to next script
    }
  }

  // Fallback: Try to extract from HTML structure
  return scrapeFromHtml(root, url);
}

/**
 * Find Recipe object in JSON-LD (can be nested in @graph)
 */
function findRecipeInJsonLd(data: any): any | null {
  if (Array.isArray(data)) {
    for (const item of data) {
      const found = findRecipeInJsonLd(item);
      if (found) return found;
    }
    return null;
  }

  if (data['@type'] === 'Recipe') {
    return data;
  }

  if (data['@graph']) {
    return findRecipeInJsonLd(data['@graph']);
  }

  return null;
}

/**
 * Parse JSON-LD Recipe into our format
 */
function parseJsonLdRecipe(recipe: any, url: string): ScrapedRecipe {
  // Parse ingredients
  const ingredients = (recipe.recipeIngredient || []).map((i: string) => i.trim());

  // Parse instructions
  let instructions: string[] = [];
  if (Array.isArray(recipe.recipeInstructions)) {
    instructions = recipe.recipeInstructions.map((inst: any) => {
      if (typeof inst === 'string') return inst;
      if (inst.text) return inst.text;
      if (inst.name) return inst.name;
      return '';
    }).filter(Boolean);
  }

  // Parse time (ISO 8601 duration like PT30M)
  const prepTime = parseDuration(recipe.prepTime);
  const cookTime = parseDuration(recipe.cookTime);

  // Parse servings
  let servings = 4;
  if (recipe.recipeYield) {
    const match = String(recipe.recipeYield).match(/\d+/);
    if (match) servings = parseInt(match[0]);
  }

  return {
    title: recipe.name || 'Untitled Recipe',
    description: recipe.description || '',
    ingredients,
    instructions,
    prepTime,
    cookTime,
    servings,
    cuisine: Array.isArray(recipe.recipeCuisine)
      ? recipe.recipeCuisine[0]
      : recipe.recipeCuisine,
    source: new URL(url).hostname,
    sourceUrl: url,
  };
}

/**
 * Parse ISO 8601 duration to minutes
 */
function parseDuration(duration: string | undefined): number | undefined {
  if (!duration) return undefined;

  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return undefined;

  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  return hours * 60 + minutes;
}

/**
 * Fallback: Scrape from HTML structure
 */
function scrapeFromHtml(root: any, url: string): ScrapedRecipe {
  // Try common recipe selectors
  const title =
    root.querySelector('h1')?.textContent?.trim() ||
    root.querySelector('.recipe-title')?.textContent?.trim() ||
    root.querySelector('[itemprop="name"]')?.textContent?.trim() ||
    'Untitled Recipe';

  const description =
    root.querySelector('.recipe-summary')?.textContent?.trim() ||
    root.querySelector('[itemprop="description"]')?.textContent?.trim() ||
    root.querySelector('.entry-content p')?.textContent?.trim() ||
    '';

  // Try to find ingredients
  const ingredientElements =
    root.querySelectorAll('.wprm-recipe-ingredient') ||
    root.querySelectorAll('[itemprop="recipeIngredient"]') ||
    root.querySelectorAll('.ingredient');

  const ingredients = ingredientElements.map((el: any) => el.textContent?.trim()).filter(Boolean);

  // Try to find instructions
  const instructionElements =
    root.querySelectorAll('.wprm-recipe-instruction') ||
    root.querySelectorAll('[itemprop="recipeInstructions"] li') ||
    root.querySelectorAll('.instruction');

  const instructions = instructionElements.map((el: any) => el.textContent?.trim()).filter(Boolean);

  return {
    title,
    description,
    ingredients,
    instructions,
    source: new URL(url).hostname,
    sourceUrl: url,
  };
}
