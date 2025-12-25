import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  const { data: recipes } = await supabase
    .from('recipes')
    .select('slug, title, featured_image_url')
    .order('created_at');

  recipes?.forEach(r => console.log(`${r.slug}: ${r.featured_image_url}`));
}

main();
