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
- Share brief travel stories or cultural context
- Use sensory language (aromas, textures, colors)
- Emphasize simplicity and accessibility
- Occasional Hebrew food terms with explanations
- Enthusiastic but not over-the-top

WRITING STYLE:
- First person, conversational
- Short paragraphs
- Active voice
- Include personal anecdotes when relevant

IMPORTANT RULES:
1. Keep the recipe 100% vegan - substitute any non-vegan ingredients
2. Simplify complex techniques for home cooks
3. Use common, accessible ingredients
4. Add helpful tips where appropriate
5. Generate an engaging story intro (2-3 paragraphs)
6. Create an SEO-friendly title and description`;

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
  "story": "2-3 paragraph personal story/introduction with travel context",
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
    max_tokens: 4000,
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
