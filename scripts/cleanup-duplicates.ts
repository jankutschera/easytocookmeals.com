import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function cleanup() {
  // Get all recipes
  const { data: recipes, error } = await supabase
    .from('recipes')
    .select('id, slug, title, created_at')
    .order('created_at');

  if (error) {
    console.error('Error fetching recipes:', error);
    return;
  }

  console.log('All recipes in database:\n');
  recipes?.forEach((r, i) => {
    console.log(`${i + 1}. ${r.slug}`);
  });

  console.log(`\nTotal: ${recipes?.length} recipes`);

  // Delete old recipes with long slugs (they contain multiple dashes and long phrases)
  const oldSlugs = [
    'authentic-falafel-my-middle-eastern-discovery-that-changed-everything',
    'vegan-sweet-potato-plantain-bowl-with-quinoa',
    'from-jerusalem-gardens-to-your-table-discovering-the-magic-of-zucchini-carrot-crustless-pizza',
    'healthy-vegan-oreos',
  ];

  console.log('\nDeleting old duplicate recipes...');

  for (const slug of oldSlugs) {
    const { error: delError } = await supabase
      .from('recipes')
      .delete()
      .eq('slug', slug);

    if (delError) {
      console.log(`  ❌ Failed to delete ${slug}: ${delError.message}`);
    } else {
      console.log(`  ✅ Deleted: ${slug}`);
    }
  }

  // Verify final count
  const { count } = await supabase
    .from('recipes')
    .select('*', { count: 'exact', head: true });

  console.log(`\nFinal recipe count: ${count}`);
}

cleanup();
