import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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
- Personal anecdotes and real experiences`;

async function updateLatestRecipe() {
  // Get the most recent draft recipe
  const { data: recipes, error } = await supabase
    .from('recipes')
    .select(`
      id,
      title,
      slug,
      description,
      servings,
      status
    `)
    .order('created_at', { ascending: false })
    .limit(5);

  if (error || !recipes?.length) {
    console.error('No recipes found:', error);
    return;
  }

  console.log('Recent recipes:');
  recipes.forEach((r, i) => console.log(`${i + 1}. [${r.status}] ${r.title}`));

  // Get the most recent one (or filter for draft)
  const recipe = recipes[0];
  console.log(`\n📝 Updating: ${recipe.title} (${recipe.id})`);

  // Get ingredients for this recipe
  const { data: groups } = await supabase
    .from('ingredient_groups')
    .select('*, ingredients(*)')
    .eq('recipe_id', recipe.id)
    .order('sort_order');

  const ingredientList = groups?.flatMap(g =>
    g.ingredients.map((i: any) => `${i.amount || ''} ${i.unit || ''} ${i.name}${i.notes ? ` (${i.notes})` : ''}`.trim())
  ) || [];

  console.log('Ingredients:', ingredientList);

  // Generate new story and nutrition
  const prompt = `For this vegan recipe, generate:
1. A comprehensive story (500-800 words) following these guidelines:
   - Personal travel story (2-3 paragraphs) with specific location, sensory details
   - Why this recipe is special (1-2 paragraphs)
   - Tips for best results (1-2 paragraphs)
   - Variations & substitutions (1-2 paragraphs)
   - Storage & make-ahead tips (1 paragraph)
   Use ## subheadings like "## Why You'll Love This Recipe"

2. Estimated nutrition facts per serving

Recipe: ${recipe.title}
Description: ${recipe.description}
Servings: ${recipe.servings}

Ingredients:
${ingredientList.map(i => `- ${i}`).join('\n')}

Return JSON:
{
  "story": "the comprehensive story with ## subheadings...",
  "nutrition": {
    "serving_size": "1 roll" or similar,
    "calories": <number>,
    "carbs_g": <number>,
    "protein_g": <number>,
    "fat_g": <number>,
    "saturated_fat_g": <number>,
    "fiber_g": <number>,
    "sugar_g": <number>,
    "sodium_mg": <number>
  }
}`;

  console.log('\n🤖 Calling Claude...');

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 4000,
    system: BRAND_VOICE_PROMPT,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = response.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type');
  }

  // Parse JSON
  let text = content.text;
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    text = codeBlockMatch[1];
  }
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.error('No JSON found in response');
    return;
  }

  const result = JSON.parse(jsonMatch[0]);
  console.log('\n📊 Nutrition:', result.nutrition);
  console.log('\n📖 Story preview:', result.story.substring(0, 200) + '...');

  // Update recipe with new story
  const { error: updateError } = await supabase
    .from('recipes')
    .update({ story: result.story })
    .eq('id', recipe.id);

  if (updateError) {
    console.error('Failed to update story:', updateError);
  } else {
    console.log('✅ Story updated');
  }

  // Check if nutrition already exists
  const { data: existingNutrition } = await supabase
    .from('nutrition')
    .select('recipe_id')
    .eq('recipe_id', recipe.id)
    .single();

  if (existingNutrition) {
    // Update existing
    const { error: nutritionError } = await supabase
      .from('nutrition')
      .update({
        serving_size: result.nutrition.serving_size,
        calories: result.nutrition.calories,
        carbs_g: result.nutrition.carbs_g,
        protein_g: result.nutrition.protein_g,
        fat_g: result.nutrition.fat_g,
        saturated_fat_g: result.nutrition.saturated_fat_g,
        fiber_g: result.nutrition.fiber_g,
        sugar_g: result.nutrition.sugar_g,
        sodium_mg: result.nutrition.sodium_mg,
      })
      .eq('recipe_id', recipe.id);

    if (nutritionError) {
      console.error('Failed to update nutrition:', nutritionError);
    } else {
      console.log('✅ Nutrition updated');
    }
  } else {
    // Insert new
    const { error: nutritionError } = await supabase
      .from('nutrition')
      .insert({
        recipe_id: recipe.id,
        serving_size: result.nutrition.serving_size,
        calories: result.nutrition.calories,
        carbs_g: result.nutrition.carbs_g,
        protein_g: result.nutrition.protein_g,
        fat_g: result.nutrition.fat_g,
        saturated_fat_g: result.nutrition.saturated_fat_g,
        fiber_g: result.nutrition.fiber_g,
        sugar_g: result.nutrition.sugar_g,
        sodium_mg: result.nutrition.sodium_mg,
      });

    if (nutritionError) {
      console.error('Failed to insert nutrition:', nutritionError);
    } else {
      console.log('✅ Nutrition inserted');
    }
  }

  console.log('\n🎉 Done!');
}

updateLatestRecipe().catch(console.error);
