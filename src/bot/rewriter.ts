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
  nutrition: {
    serving_size: string;
    calories: number;
    carbs_g: number;
    protein_g: number;
    fat_g: number;
    saturated_fat_g: number;
    fiber_g: number;
    sugar_g: number;
    sodium_mg: number;
  };
  featured_image_url?: string;
}

const BRAND_VOICE_PROMPT = `You are a recipe content writer for Easy To Cook Meals, a vegan food blog run by an Israeli chef couple (Sandra & Jan) who travel the world discovering plant-based recipes.

BRAND VOICE:
- Warm, inviting, and personal
- First person plural ("we discovered", "our kitchen")
- Share travel stories and cultural context
- Use sensory language (aromas, textures, colors)
- Emphasize simplicity and accessibility
- Enthusiastic but professional

IMPORTANT RULES:
1. Keep the recipe 100% vegan - substitute any non-vegan ingredients
2. Simplify complex techniques for home cooks
3. Use common, accessible ingredients
4. Create SEO-friendly title and description

ARTICLE STRUCTURE (The "story" field):
Write 600-900 words following this EXACT structure with markdown headings:

**INTRO (2-3 short paragraphs, no heading)**
- Hook the reader with what makes this dish special
- Brief personal story (where you discovered it, a memory)
- What they'll love about making it

**## Why You'll Love This Recipe**
Write 4-5 bullet points starting with emoji, like:
- ✅ Ready in just 30 minutes
- ✅ Uses simple pantry ingredients
- ✅ Naturally gluten-free
- ✅ High in protein (15g per serving)
- ✅ Perfect for meal prep

**## Ingredients Notes**
Explain 2-3 key/unusual ingredients:
- What they are, where to find them
- Possible substitutions
- Why they're important to the recipe

**## Pro Tips for Success**
3-4 tips with bold headers like:
- **Don't skip the marinade time** - This is what gives...
- **Use firm tofu** - Silken won't hold up...

**## How to Serve**
2-3 sentences on serving suggestions, pairings, garnishes.

**## FAQ**
Answer these common questions in Q&A format:
- **Can I make this ahead?** Answer...
- **How do I store leftovers?** Answer with days...
- **Can I freeze this?** Answer with details...
- **How do I reheat?** Best method...

RECIPE CARD INSTRUCTIONS:
Keep instructions CONCISE and action-focused. No chatty language.
Each step should be 1-2 sentences max.
Example: "Press and cube the tofu. Toss with marinade ingredients and refrigerate for 30 minutes."
NOT: "Now comes the fun part! You'll want to take your beautiful tofu and..."`;


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
  "story": "600-900 word article following the ARTICLE STRUCTURE above. Use ## for headings. Include emoji bullets for 'Why You'll Love' section.",
  "prepTime": <number in minutes>,
  "cookTime": <number in minutes>,
  "servings": <number>,
  "cuisine": ["cuisine1", "cuisine2"],
  "course": ["Main Course", "Dinner"],
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "ingredientGroups": [
    {
      "name": "For the marinade" or null for single group,
      "ingredients": [
        {
          "amount": "1" or null,
          "unit": "cup" or null,
          "name": "ingredient name",
          "notes": "pressed and cubed" or null
        }
      ]
    }
  ],
  "instructions": [
    {"step": 1, "text": "CONCISE action instruction. 1-2 sentences max."}
  ],
  "nutrition": {
    "serving_size": "1 serving" or "1/4 of recipe" etc.,
    "calories": <number per serving>,
    "carbs_g": <number>,
    "protein_g": <number>,
    "fat_g": <number>,
    "saturated_fat_g": <number>,
    "fiber_g": <number>,
    "sugar_g": <number>,
    "sodium_mg": <number>
  }
}

NUTRITION: Estimate per serving using standard databases. Round to whole numbers.

INSTRUCTIONS STYLE:
- Start with action verb: "Press", "Mix", "Heat", "Add"
- Be specific about time/temperature: "Bake at 400°F for 25 minutes"
- Combine related actions: "Press tofu for 15 minutes, then cube into 1-inch pieces."
- NO chatty intros like "Now it's time to..." or "Here's where the magic happens..."

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
