import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function verify() {
  console.log('🔍 Verifying database tables...\n');

  const tables = ['recipes', 'ingredient_groups', 'ingredients', 'instructions', 'nutrition', 'equipment', 'ratings'];

  for (const table of tables) {
    const { count, error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.log(`❌ ${table}: ${error.message}`);
    } else {
      console.log(`✅ ${table}: OK (${count} rows)`);
    }
  }

  console.log('\n🎉 Database setup complete!');
}

verify();
