import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkAll() {
  const { data: recipes } = await supabase
    .from('recipes')
    .select('slug, title, featured_image_url')
    .order('title');

  console.log('\nAll imported recipes:');
  recipes?.forEach((r, i) => {
    console.log(`${i + 1}. ${r.title}`);
    console.log(`   Slug: ${r.slug}`);
    console.log(`   Image: ${r.featured_image_url}`);
  });
}

checkAll();
