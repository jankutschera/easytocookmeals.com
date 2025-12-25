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
 * Check if URL is an Instagram post/reel
 */
function isInstagramUrl(url: string): boolean {
  return url.includes('instagram.com/p/') || url.includes('instagram.com/reel/');
}

/**
 * Scrape caption from Instagram post/reel using oEmbed API
 */
async function scrapeInstagramCaption(url: string): Promise<ScrapedRecipe> {
  console.log(`📸 Scraping Instagram: ${url}`);

  // Clean URL (remove tracking params)
  const cleanUrl = url.split('?')[0];

  // Use Instagram's official oEmbed API
  const oembedUrl = `https://api.instagram.com/oembed?url=${encodeURIComponent(cleanUrl)}`;
  console.log(`📡 Calling oEmbed API: ${oembedUrl}`);

  const response = await fetch(oembedUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible)',
    },
  });

  if (!response.ok) {
    console.log(`❌ oEmbed failed: ${response.status}`);
    throw new Error(`Instagram oEmbed API failed: ${response.status}. The post may be private.`);
  }

  const data = await response.json();
  console.log(`✅ oEmbed response:`, JSON.stringify(data).substring(0, 200));

  // oEmbed returns: title, author_name, html (embed code)
  // The title often contains the caption (truncated)
  const caption = data.title || '';
  const author = data.author_name || 'Instagram';

  if (!caption) {
    throw new Error('Could not extract caption from Instagram. The post may have no caption or be private.');
  }

  console.log(`📝 Caption: ${caption.substring(0, 100)}...`);

  // Parse the caption as a recipe
  const lines = caption.split('\n').filter((l: string) => l.trim());
  const title = lines[0]?.replace(/[🤤💚➡️📸🍽️🌱✨]/g, '').trim() || 'Instagram Recipe';

  // Look for ingredients (lines starting with - or •)
  const ingredients = lines
    .filter((l: string) => l.trim().startsWith('-') || l.trim().startsWith('•'))
    .map((l: string) => l.replace(/^[-•]\s*/, '').trim());

  // Look for instructions (lines starting with ➡️ or numbered)
  const instructions = lines
    .filter((l: string) => l.includes('➡️') || /^\d+[.)]/.test(l.trim()))
    .map((l: string) => l.replace(/^➡️\s*/, '').replace(/^\d+[.)]\s*/, '').trim());

  return {
    title,
    description: caption,
    ingredients,
    instructions,
    source: `Instagram (@${author})`,
    sourceUrl: cleanUrl,
  };
}

/**
 * Scrape recipe from URL
 * Supports JSON-LD schema.org/Recipe format (most recipe sites)
 */
export async function scrapeRecipe(url: string): Promise<ScrapedRecipe> {
  console.log(`🔍 Scraping URL: ${url}`);

  // Special handling for Instagram
  if (isInstagramUrl(url)) {
    return scrapeInstagramCaption(url);
  }

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${response.status}`);
  }

  const html = await response.text();
  console.log(`📄 Fetched ${html.length} bytes`);

  const root = parse(html);

  // Try to find JSON-LD recipe data
  const jsonLdScripts = root.querySelectorAll('script[type="application/ld+json"]');
  console.log(`📋 Found ${jsonLdScripts.length} JSON-LD scripts`);

  for (const script of jsonLdScripts) {
    try {
      const data = JSON.parse(script.textContent);
      const recipe = findRecipeInJsonLd(data);
      if (recipe) {
        console.log(`✅ Found JSON-LD recipe: ${recipe.name}`);
        const parsed = parseJsonLdRecipe(recipe, url);
        console.log(`📦 Parsed: ${parsed.ingredients.length} ingredients, ${parsed.instructions.length} instructions`);
        return parsed;
      }
    } catch (e) {
      console.log(`⚠️ JSON-LD parse error:`, e);
    }
  }

  // Fallback: Try to extract from HTML structure
  console.log(`🔄 Falling back to HTML scraping`);
  const fallback = scrapeFromHtml(root, url);
  console.log(`📦 HTML fallback: ${fallback.ingredients.length} ingredients, ${fallback.instructions.length} instructions`);
  return fallback;
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
