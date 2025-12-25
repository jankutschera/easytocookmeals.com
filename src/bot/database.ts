import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log(`🔌 Supabase URL: ${supabaseUrl ? 'Set' : 'MISSING!'}`);
console.log(`🔑 Supabase Key: ${supabaseKey ? 'Set (' + supabaseKey.substring(0, 10) + '...)' : 'MISSING!'}`);

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase environment variables are missing!');
}

const supabase = createClient(supabaseUrl || '', supabaseKey || '');

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
    name: string | null;
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

/**
 * Save a rewritten recipe as a draft in Supabase
 */
export async function saveRecipeDraft(recipe: RewrittenRecipe): Promise<any> {
  console.log('💾 saveRecipeDraft called with:', recipe.title);
  console.log('📋 Recipe data:', JSON.stringify(recipe, null, 2).substring(0, 500));

  // Ensure unique slug
  const slug = await ensureUniqueSlug(recipe.slug);
  console.log('🔗 Unique slug:', slug);

  // 1. Insert recipe
  const { data: recipeRow, error: recipeError } = await supabase
    .from('recipes')
    .insert({
      slug,
      title: recipe.title,
      description: recipe.description,
      story: recipe.story,
      prep_time_minutes: recipe.prepTime,
      cook_time_minutes: recipe.cookTime,
      servings: recipe.servings,
      servings_unit: 'servings',
      cuisine: recipe.cuisine,
      course: recipe.course,
      keywords: recipe.keywords,
      featured_image_url: recipe.featured_image_url || null,
      status: 'draft', // Save as draft, not published
    })
    .select()
    .single();

  if (recipeError) {
    throw new Error(`Failed to save recipe: ${recipeError.message}`);
  }

  const recipeId = recipeRow.id;

  // 2. Insert ingredient groups and ingredients
  for (let groupIndex = 0; groupIndex < recipe.ingredientGroups.length; groupIndex++) {
    const group = recipe.ingredientGroups[groupIndex];

    const { data: groupRow, error: groupError } = await supabase
      .from('ingredient_groups')
      .insert({
        recipe_id: recipeId,
        title: group.name,
        sort_order: groupIndex,
      })
      .select()
      .single();

    if (groupError) {
      console.error('Group insert error:', groupError);
      continue;
    }

    // Insert ingredients
    const ingredients = group.ingredients.map((ing, idx) => ({
      group_id: groupRow.id,
      amount: parseFloat(ing.amount || '') || null,
      unit: ing.unit || null,
      name: ing.name,
      notes: ing.notes || null,
      sort_order: idx,
    }));

    const { error: ingError } = await supabase
      .from('ingredients')
      .insert(ingredients);

    if (ingError) {
      console.error('Ingredients insert error:', ingError);
    }
  }

  // 3. Insert instructions
  const instructions = recipe.instructions.map((inst) => ({
    recipe_id: recipeId,
    step_number: inst.step,
    text: inst.text,
  }));

  const { error: instError } = await supabase
    .from('instructions')
    .insert(instructions);

  if (instError) {
    console.error('Instructions insert error:', instError);
  }

  return recipeRow;
}

/**
 * Ensure slug is unique by appending number if needed
 */
async function ensureUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const { data } = await supabase
      .from('recipes')
      .select('id')
      .eq('slug', slug)
      .single();

    if (!data) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;

    if (counter > 100) {
      throw new Error('Could not generate unique slug');
    }
  }
}

/**
 * Update recipe status to published
 */
export async function publishRecipe(recipeId: string): Promise<void> {
  const { error } = await supabase
    .from('recipes')
    .update({
      status: 'published',
      published_at: new Date().toISOString(),
    })
    .eq('id', recipeId);

  if (error) {
    throw new Error(`Failed to publish recipe: ${error.message}`);
  }
}

/**
 * Get all draft recipes
 */
export async function getDraftRecipes(): Promise<any[]> {
  const { data, error } = await supabase
    .from('recipes')
    .select('id, title, slug, created_at')
    .eq('status', 'draft')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch drafts: ${error.message}`);
  }

  return data || [];
}
