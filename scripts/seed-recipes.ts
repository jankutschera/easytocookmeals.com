import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import recipesData from '../data/recipes.json';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function parseNumber(value: string | number | undefined): number | null {
  if (value === undefined || value === null) return null;
  if (typeof value === 'number') return value;
  const parsed = parseFloat(value.replace(/[^\d.]/g, ''));
  return isNaN(parsed) ? null : parsed;
}

async function seedRecipes() {
  console.log('🌱 Seeding recipes...\n');

  for (const recipe of recipesData.recipes) {
    console.log(`📝 Inserting: ${recipe.title}`);

    // 1. Insert recipe
    const { data: recipeRow, error: recipeError } = await supabase
      .from('recipes')
      .insert({
        slug: recipe.slug,
        title: recipe.title,
        description: recipe.description,
        story: recipe.story,
        prep_time_minutes: recipe.prepTime,
        cook_time_minutes: recipe.cookTime,
        rest_time_minutes: recipe.additionalTime || null,
        servings: recipe.servings,
        servings_unit: 'servings',
        cuisine: Array.isArray(recipe.cuisine) ? recipe.cuisine : [recipe.cuisine],
        course: Array.isArray(recipe.course) ? recipe.course : [recipe.course],
        keywords: recipe.keywords,
        status: 'published',
        published_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (recipeError) {
      console.error(`  ❌ Recipe error: ${recipeError.message}`);
      continue;
    }

    const recipeId = recipeRow.id;
    console.log(`  ✅ Recipe inserted (${recipeId})`);

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
        console.error(`  ❌ Group error: ${groupError.message}`);
        continue;
      }

      // Insert ingredients
      const ingredients = group.ingredients.map((ing, idx) => ({
        group_id: groupRow.id,
        amount: ing.amount || null,
        unit: ing.unit || null,
        name: ing.name,
        notes: ing.notes || null,
        sort_order: idx,
      }));

      const { error: ingError } = await supabase
        .from('ingredients')
        .insert(ingredients);

      if (ingError) {
        console.error(`  ❌ Ingredients error: ${ingError.message}`);
      }
    }
    console.log(`  ✅ ${recipe.ingredientGroups.length} ingredient groups inserted`);

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
      console.error(`  ❌ Instructions error: ${instError.message}`);
    } else {
      console.log(`  ✅ ${recipe.instructions.length} instructions inserted`);
    }

    // 4. Insert nutrition
    if (recipe.nutrition) {
      const { error: nutritionError } = await supabase
        .from('nutrition')
        .insert({
          recipe_id: recipeId,
          serving_size: recipe.nutrition.servingSize,
          calories: parseNumber(recipe.nutrition.calories),
          protein_g: parseNumber(recipe.nutrition.protein),
          fat_g: parseNumber(recipe.nutrition.fat),
          carbs_g: parseNumber(recipe.nutrition.carbohydrates),
          fiber_g: parseNumber(recipe.nutrition.fiber),
          sugar_g: parseNumber(recipe.nutrition.sugar),
          sodium_mg: parseNumber(recipe.nutrition.sodium),
          saturated_fat_g: parseNumber(recipe.nutrition.saturatedFat),
          potassium_mg: parseNumber(recipe.nutrition.potassium),
          vitamin_a_iu: parseNumber(recipe.nutrition.vitaminA),
          vitamin_c_mg: parseNumber(recipe.nutrition.vitaminC),
          calcium_mg: parseNumber(recipe.nutrition.calcium),
          iron_mg: parseNumber(recipe.nutrition.iron),
        });

      if (nutritionError) {
        console.error(`  ❌ Nutrition error: ${nutritionError.message}`);
      } else {
        console.log(`  ✅ Nutrition facts inserted`);
      }
    }

    console.log('');
  }

  console.log('🎉 Seeding complete!');

  // Verify counts
  const { count: recipeCount } = await supabase.from('recipes').select('*', { count: 'exact', head: true });
  const { count: groupCount } = await supabase.from('ingredient_groups').select('*', { count: 'exact', head: true });
  const { count: ingredientCount } = await supabase.from('ingredients').select('*', { count: 'exact', head: true });
  const { count: instructionCount } = await supabase.from('instructions').select('*', { count: 'exact', head: true });
  const { count: nutritionCount } = await supabase.from('nutrition').select('*', { count: 'exact', head: true });

  console.log(`\n📊 Final counts:`);
  console.log(`   Recipes: ${recipeCount}`);
  console.log(`   Ingredient groups: ${groupCount}`);
  console.log(`   Ingredients: ${ingredientCount}`);
  console.log(`   Instructions: ${instructionCount}`);
  console.log(`   Nutrition records: ${nutritionCount}`);
}

seedRecipes();
