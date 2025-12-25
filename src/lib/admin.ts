import { createServerClient } from './supabase';
import type { Recipe } from '@/types/recipe';

/**
 * Get all recipes for admin (including drafts)
 */
export async function getAllRecipesAdmin(): Promise<Recipe[]> {
  console.log('🔍 getAllRecipesAdmin called');
  console.log('🔑 SUPABASE_SERVICE_ROLE_KEY exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
  console.log('🌐 NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);

  const supabase = createServerClient();

  if (!supabase) {
    console.warn('❌ Supabase not configured - createServerClient returned null');
    return [];
  }

  console.log('✅ Supabase client created successfully');

  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Admin recipes fetch error:', error);
    return [];
  }

  console.log(`✅ Fetched ${data?.length || 0} recipes`);
  if (data && data.length > 0) {
    console.log('📋 Recipe statuses:', data.map(r => ({ title: r.title?.substring(0, 30), status: r.status })));
  }

  return data as Recipe[];
}

/**
 * Get single recipe by ID for editing
 */
export async function getRecipeById(id: string): Promise<Recipe | null> {
  const supabase = createServerClient();

  if (!supabase) {
    console.warn('Supabase not configured');
    return null;
  }

  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Recipe fetch error:', error);
    return null;
  }

  return data as Recipe;
}

/**
 * Update recipe status
 */
export async function updateRecipeStatus(
  id: string,
  status: 'draft' | 'published' | 'archived'
): Promise<void> {
  const supabase = createServerClient();

  if (!supabase) {
    throw new Error('Database not configured');
  }

  const updates: any = { status };
  if (status === 'published') {
    updates.published_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from('recipes')
    .update(updates)
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to update status: ${error.message}`);
  }
}

/**
 * Delete recipe and all related data
 */
export async function deleteRecipe(id: string): Promise<void> {
  const supabase = createServerClient();

  if (!supabase) {
    throw new Error('Database not configured');
  }

  const { error } = await supabase
    .from('recipes')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete recipe: ${error.message}`);
  }
}

/**
 * Update recipe
 */
export async function updateRecipe(
  id: string,
  data: Partial<Recipe>
): Promise<void> {
  const supabase = createServerClient();

  if (!supabase) {
    throw new Error('Database not configured');
  }

  const { error } = await supabase
    .from('recipes')
    .update(data)
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to update recipe: ${error.message}`);
  }
}
