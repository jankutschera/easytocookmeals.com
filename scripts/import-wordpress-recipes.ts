import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import wordpressRecipes from '../data/recipes-from-wordpress.json';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Image path mapping
const IMAGE_PATHS: Record<string, string> = {
  'zucchini-carrot-crustless-pizza': '/images/recipes/zucchini-carrot-crustless-pizza/featured.jpg',
  'authentic-falafel': '/images/recipes/authentic-falafel/featured.jpeg',
  'vegan-sweet-potato-plantain-bowl': '/images/recipes/vegan-sweet-potato-plantain-bowl/featured.jpg',
  'watermelon-kiwi-smoothie': '/images/recipes/watermelon-kiwi-smoothie/featured.png',
  'tropical-coconut-chia-pudding': '/images/recipes/tropical-coconut-chia-pudding/featured.png',
  'vegan-oreos': '/images/recipes/vegan-oreos/featured.png',
  'overnight-oatmeal': '/images/recipes/overnight-oatmeal/featured.png',
  'vegan-turkey-pasta-sauce': '/images/recipes/vegan-turkey-pasta-sauce/featured.png',
  'vegan-asian-beef-broccoli': '/images/recipes/vegan-asian-beef-broccoli/featured.png',
  'vegan-raclette-cheese': '/images/recipes/vegan-raclette-cheese/featured.png',
  'vegan-mozzarella': '/images/recipes/vegan-mozzarella/featured.png',
  'dinner-rolls': '/images/recipes/dinner-rolls/featured.png',
};

// Parse time strings like "15 minutes", "1 day", "8 hours" to minutes
function parseTimeToMinutes(timeStr: string | undefined): number | null {
  if (!timeStr) return null;

  const lowerStr = timeStr.toLowerCase();

  // Match patterns like "15 minutes", "1 hour", "1 day"
  const minuteMatch = lowerStr.match(/(\d+)\s*min/);
  if (minuteMatch) return parseInt(minuteMatch[1]);

  const hourMatch = lowerStr.match(/(\d+)\s*hour/);
  if (hourMatch) return parseInt(hourMatch[1]) * 60;

  const dayMatch = lowerStr.match(/(\d+)\s*day/);
  if (dayMatch) return parseInt(dayMatch[1]) * 1440;

  return null;
}

// Parse nutrition values like "24g", "165", "450 IU"
function parseNumber(value: string | number | undefined): number | null {
  if (value === undefined || value === null) return null;
  if (typeof value === 'number') return value;
  const parsed = parseFloat(value.toString().replace(/[^\d.]/g, ''));
  return isNaN(parsed) ? null : parsed;
}

// Parse ingredient amount to separate amount and unit
function parseIngredientAmount(amountStr: string): { amount: number | null; unit: string | null } {
  if (!amountStr || amountStr.trim() === '') {
    return { amount: null, unit: null };
  }

  // Handle fractions and mixed numbers
  const fractionMatch = amountStr.match(/(\d+)?\s*(\d+)\/(\d+)/);
  if (fractionMatch) {
    const whole = fractionMatch[1] ? parseInt(fractionMatch[1]) : 0;
    const numerator = parseInt(fractionMatch[2]);
    const denominator = parseInt(fractionMatch[3]);
    const amount = whole + (numerator / denominator);
    const unit = amountStr.replace(fractionMatch[0], '').trim() || null;
    return { amount, unit };
  }

  // Extract number from beginning
  const numberMatch = amountStr.match(/^([\d.]+)/);
  if (numberMatch) {
    const amount = parseFloat(numberMatch[1]);
    const unit = amountStr.replace(numberMatch[0], '').trim() || null;
    return { amount, unit };
  }

  // No number found, entire string is unit/description
  return { amount: null, unit: amountStr };
}

async function deleteExistingRecipes() {
  console.log('🗑️  Deleting existing recipes...\n');

  const { error } = await supabase
    .from('recipes')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

  if (error) {
    console.error('Error deleting recipes:', error);
    throw error;
  }

  console.log('✅ All existing recipes deleted\n');
}

async function importRecipes() {
  console.log('🌱 Importing WordPress recipes...\n');

  for (const wpRecipe of wordpressRecipes.recipes) {
    console.log(`📝 Processing: ${wpRecipe.title}`);

    // Transform time values
    const prepTime = parseTimeToMinutes(wpRecipe.prepTime);
    const cookTime = parseTimeToMinutes(wpRecipe.cookTime);
    const restTime = parseTimeToMinutes(wpRecipe.restTime || wpRecipe.soakingTime);

    // Transform cuisine and course to arrays
    const cuisineArray = wpRecipe.cuisine
      ? wpRecipe.cuisine.split(',').map(c => c.trim())
      : [];
    const courseArray = wpRecipe.course
      ? wpRecipe.course.split(',').map(c => c.trim())
      : [];

    // 1. Insert recipe
    const { data: recipeRow, error: recipeError } = await supabase
      .from('recipes')
      .insert({
        slug: wpRecipe.slug,
        title: wpRecipe.title,
        description: wpRecipe.title, // Using title as description since not in source
        story: wpRecipe.story,
        prep_time_minutes: prepTime,
        cook_time_minutes: cookTime,
        rest_time_minutes: restTime,
        servings: wpRecipe.servings,
        servings_unit: wpRecipe.servingUnit || 'servings',
        cuisine: cuisineArray,
        course: courseArray,
        keywords: wpRecipe.keywords || [],
        featured_image_url: IMAGE_PATHS[wpRecipe.slug] || wpRecipe.featuredImage,
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

    // 2. Transform and insert ingredient groups
    let ingredientGroups: Array<{ name: string; ingredients: any[] }> = [];

    if (wpRecipe.ingredientGroups && wpRecipe.ingredientGroups.length > 0) {
      // Recipe has explicit ingredient groups
      ingredientGroups = wpRecipe.ingredientGroups;
    } else if (wpRecipe.variations && wpRecipe.variations.length > 0) {
      // Handle variations (like overnight-oatmeal) - each variation is a group
      ingredientGroups = wpRecipe.variations.map(v => ({
        name: v.name,
        ingredients: v.ingredients
      }));
    } else if (wpRecipe.ingredients && wpRecipe.ingredients.length > 0) {
      // Flat ingredients array - create single default group
      ingredientGroups = [{
        name: 'Ingredients',
        ingredients: wpRecipe.ingredients
      }];
    }

    for (let groupIndex = 0; groupIndex < ingredientGroups.length; groupIndex++) {
      const group = ingredientGroups[groupIndex];

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

      // Insert ingredients (transform item → name)
      const ingredients = group.ingredients.map((ing: any, idx: number) => {
        const { amount, unit } = parseIngredientAmount(ing.amount || '');

        return {
          group_id: groupRow.id,
          amount,
          unit,
          name: ing.item || ing.name, // Handle both 'item' and 'name' fields
          notes: ing.notes || null,
          sort_order: idx,
        };
      });

      const { error: ingError } = await supabase
        .from('ingredients')
        .insert(ingredients);

      if (ingError) {
        console.error(`  ❌ Ingredients error: ${ingError.message}`);
      }
    }
    console.log(`  ✅ ${ingredientGroups.length} ingredient group(s) inserted`);

    // 3. Insert instructions
    if (wpRecipe.instructions && wpRecipe.instructions.length > 0) {
      const instructions = wpRecipe.instructions.map((text: string, idx: number) => ({
        recipe_id: recipeId,
        step_number: idx + 1,
        text: text,
      }));

      const { error: instError } = await supabase
        .from('instructions')
        .insert(instructions);

      if (instError) {
        console.error(`  ❌ Instructions error: ${instError.message}`);
      } else {
        console.log(`  ✅ ${wpRecipe.instructions.length} instructions inserted`);
      }
    }

    // 4. Insert nutrition
    if (wpRecipe.nutrition) {
      const { error: nutritionError } = await supabase
        .from('nutrition')
        .insert({
          recipe_id: recipeId,
          serving_size: null, // Not in source data
          calories: parseNumber(wpRecipe.nutrition.calories),
          protein_g: parseNumber(wpRecipe.nutrition.protein),
          fat_g: parseNumber(wpRecipe.nutrition.fat),
          carbs_g: parseNumber(wpRecipe.nutrition.carbohydrates),
          fiber_g: parseNumber(wpRecipe.nutrition.fiber),
          sugar_g: parseNumber(wpRecipe.nutrition.sugar),
          sodium_mg: parseNumber(wpRecipe.nutrition.sodium),
          saturated_fat_g: parseNumber(wpRecipe.nutrition.saturatedFat),
          potassium_mg: parseNumber(wpRecipe.nutrition.potassium),
          vitamin_a_iu: parseNumber(wpRecipe.nutrition.vitaminA),
          vitamin_c_mg: parseNumber(wpRecipe.nutrition.vitaminC),
          calcium_mg: parseNumber(wpRecipe.nutrition.calcium),
          iron_mg: parseNumber(wpRecipe.nutrition.iron),
        });

      if (nutritionError) {
        console.error(`  ❌ Nutrition error: ${nutritionError.message}`);
      } else {
        console.log(`  ✅ Nutrition facts inserted`);
      }
    }

    console.log('');
  }

  console.log('🎉 Import complete!');

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

async function main() {
  try {
    await deleteExistingRecipes();
    await importRecipes();
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

main();
