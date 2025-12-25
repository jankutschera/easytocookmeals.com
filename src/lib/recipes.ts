import { createServerClient } from './supabase';
import type {
  Recipe,
  IngredientGroup,
  Ingredient,
  Instruction,
  Nutrition,
  RecipeWithRelations,
} from '@/types/recipe';

/**
 * Get a single recipe by slug with all relations
 */
export async function getRecipeBySlug(
  slug: string
): Promise<RecipeWithRelations | null> {
  const supabase = createServerClient();

  // Get recipe
  const { data: recipe, error: recipeError } = await supabase
    .from('recipes')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (recipeError || !recipe) {
    console.error('Recipe fetch error:', recipeError);
    return null;
  }

  // Get ingredient groups with ingredients
  const { data: groups } = await supabase
    .from('ingredient_groups')
    .select('*')
    .eq('recipe_id', recipe.id)
    .order('sort_order');

  // Get ingredients for all groups
  const groupIds = groups?.map((g) => g.id) || [];
  const { data: ingredients } = await supabase
    .from('ingredients')
    .select('*')
    .in('group_id', groupIds)
    .order('sort_order');

  // Combine groups with their ingredients
  const ingredientGroups = (groups || []).map((group) => ({
    ...group,
    ingredients: (ingredients || []).filter((i) => i.group_id === group.id),
  }));

  // Get instructions
  const { data: instructions } = await supabase
    .from('instructions')
    .select('*')
    .eq('recipe_id', recipe.id)
    .order('step_number');

  // Get nutrition
  const { data: nutrition } = await supabase
    .from('nutrition')
    .select('*')
    .eq('recipe_id', recipe.id)
    .single();

  // Get equipment
  const { data: equipment } = await supabase
    .from('equipment')
    .select('*')
    .eq('recipe_id', recipe.id);

  // Get ratings aggregation
  const { data: ratings } = await supabase
    .from('ratings')
    .select('rating')
    .eq('recipe_id', recipe.id);

  const ratingValues = ratings?.map((r) => r.rating) || [];
  const averageRating =
    ratingValues.length > 0
      ? ratingValues.reduce((a, b) => a + b, 0) / ratingValues.length
      : 0;

  return {
    ...recipe,
    ingredient_groups: ingredientGroups,
    instructions: instructions || [],
    nutrition: nutrition || undefined,
    equipment: equipment || [],
    average_rating: averageRating,
    rating_count: ratingValues.length,
  } as RecipeWithRelations;
}

/**
 * Get all published recipes (for listing pages)
 */
export async function getAllRecipes(): Promise<Recipe[]> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Recipes fetch error:', error);
    return [];
  }

  return data as Recipe[];
}

/**
 * Get all recipe slugs (for static generation)
 */
export async function getAllRecipeSlugs(): Promise<string[]> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('recipes')
    .select('slug')
    .eq('status', 'published');

  if (error) {
    console.error('Slugs fetch error:', error);
    return [];
  }

  return data.map((r) => r.slug);
}

/**
 * Search recipes by keyword
 */
export async function searchRecipes(query: string): Promise<Recipe[]> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('status', 'published')
    .or(
      `title.ilike.%${query}%,description.ilike.%${query}%,keywords.cs.{${query}}`
    )
    .order('published_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('Search error:', error);
    return [];
  }

  return data as Recipe[];
}

/**
 * Get recipes by cuisine
 */
export async function getRecipesByCuisine(cuisine: string): Promise<Recipe[]> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('status', 'published')
    .contains('cuisine', [cuisine])
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Cuisine filter error:', error);
    return [];
  }

  return data as Recipe[];
}

/**
 * Get recipes by course
 */
export async function getRecipesByCourse(course: string): Promise<Recipe[]> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('status', 'published')
    .contains('course', [course])
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Course filter error:', error);
    return [];
  }

  return data as Recipe[];
}
