import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

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
  sourceUrl?: string;
}

interface RewrittenRecipe {
  title: string;
  slug: string;
  description: string;
  story: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  cuisine: string[];
  course: string[];
  keywords: string[];
  ingredientGroups: {
    name: string;
    ingredients: {
      amount: string | null;
      unit: string | null;
      name: string;
      notes: string | null;
    }[];
  }[];
  instructions: {
    step: number;
    text: string;
  }[];
  featured_image_url?: string;
}

const BRAND_VOICE_PROMPT = `You are a recipe rewriter for Easy To Cook Meals, a vegan food blog run by an Israeli chef who travels the world discovering plant-based recipes.

BRAND VOICE:
- Warm, inviting, and personal
- Share travel stories and cultural context
- Use sensory language (aromas, textures, colors)
- Emphasize simplicity and accessibility
- Occasional Hebrew food terms with explanations
- Enthusiastic but not over-the-top

WRITING STYLE:
- First person, conversational
- Short paragraphs with good flow
- Active voice
- Personal anecdotes and real experiences

IMPORTANT RULES:
1. Keep the recipe 100% vegan - substitute any non-vegan ingredients
2. Simplify complex techniques for home cooks
3. Use common, accessible ingredients
4. Add helpful tips where appropriate
5. Create an SEO-friendly title and description

STORY SECTION - THIS IS CRITICAL:
Write a comprehensive, engaging story of 500-800 words (6-10 paragraphs) that includes:

1. PERSONAL TRAVEL STORY (2-3 paragraphs)
   - Specific location, time, sensory details
   - Who you met, what you saw, how it felt
   - The moment of discovery

2. WHY THIS RECIPE IS SPECIAL (1-2 paragraphs)
   - What makes it unique
   - Why readers will love it
   - Health benefits or nutritional highlights

3. TIPS FOR BEST RESULTS (1-2 paragraphs)
   - Key techniques explained
   - Common mistakes to avoid
   - Equipment recommendations

4. VARIATIONS & SUBSTITUTIONS (1-2 paragraphs)
   - Ingredient swaps for allergies/preferences
   - How to make it spicier/milder
   - Serving suggestions

5. STORAGE & MAKE-AHEAD (1 paragraph)
   - How long it keeps
   - Can it be frozen?
   - Reheating tips

Use subheadings within the story like "## Why You'll Love This Recipe" or "## Pro Tips" to break up the text.`;

/**
 * Rewrite a scraped recipe in our brand voice using Claude
 */
export async function rewriteRecipe(recipe: ScrapedRecipe): Promise<RewrittenRecipe> {
  const prompt = `Please rewrite this recipe in our brand voice and return it as JSON.

ORIGINAL RECIPE:
Title: ${recipe.title}
Description: ${recipe.description}
Cuisine: ${recipe.cuisine || 'Unknown'}
Source: ${recipe.source}

Ingredients:
${recipe.ingredients.map((i) => `- ${i}`).join('\n')}

Instructions:
${recipe.instructions.map((i, idx) => `${idx + 1}. ${i}`).join('\n')}

Prep Time: ${recipe.prepTime || 'Unknown'} minutes
Cook Time: ${recipe.cookTime || 'Unknown'} minutes
Servings: ${recipe.servings || 4}

---

Return a JSON object with this exact structure:
{
  "title": "SEO-friendly title (include key ingredient and cooking method)",
  "slug": "url-friendly-slug",
  "description": "1-2 sentence meta description for SEO (max 160 chars)",
  "story": "LONG comprehensive story (500-800 words, 6-10 paragraphs) following the STORY SECTION guidelines above. Include markdown ## subheadings.",
  "prepTime": <number in minutes>,
  "cookTime": <number in minutes>,
  "servings": <number>,
  "cuisine": ["cuisine1", "cuisine2"],
  "course": ["Main Course", "Dinner"],
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "ingredientGroups": [
    {
      "name": "For the base" or null for single group,
      "ingredients": [
        {
          "amount": "1" or null,
          "unit": "cup" or null,
          "name": "ingredient name",
          "notes": "optional notes like 'diced'" or null
        }
      ]
    }
  ],
  "instructions": [
    {"step": 1, "text": "Full instruction text rewritten in our voice"}
  ]
}

Ensure ALL ingredients are vegan. Replace any non-vegan items with plant-based alternatives.`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 8000,
    system: BRAND_VOICE_PROMPT,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  // Extract JSON from response
  const content = response.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type');
  }

  // Parse JSON from the response - handle markdown code blocks
  let text = content.text;

  // Remove markdown code blocks if present
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    text = codeBlockMatch[1];
  }

  // Find JSON object
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.error('AI response without JSON:', content.text.substring(0, 500));
    throw new Error('Could not find JSON in response');
  }

  try {
    const rewritten = JSON.parse(jsonMatch[0]) as RewrittenRecipe;
    return rewritten;
  } catch (e) {
    console.error('Failed to parse JSON:', jsonMatch[0].substring(0, 500));
    throw new Error('Failed to parse rewritten recipe JSON');
  }
}
