const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  const migrationFile = process.argv[2];
  if (!migrationFile) {
    console.error('Usage: node run-migration.js <migration-file>');
    process.exit(1);
  }

  const migrationPath = path.resolve(migrationFile);
  const sql = fs.readFileSync(migrationPath, 'utf-8');

  console.log(`Running migration: ${migrationFile}`);
  console.log('SQL:', sql.substring(0, 200) + '...');

  try {
    // Use rpc to execute raw SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error) {
      // If rpc doesn't work, try direct query approach
      console.log('RPC not available, trying alternative...');

      // For simple ALTER TABLE, we can try a workaround
      // Check if column exists first
      const { data: columns, error: columnsError } = await supabase
        .from('recipes')
        .select('*')
        .limit(1);

      if (columnsError) {
        console.error('Error checking recipes table:', columnsError);
        process.exit(1);
      }

      console.log('Recipes table exists. Sample columns:', Object.keys(columns[0] || {}));
      console.log('\nNote: For schema changes (ALTER TABLE), please run this in the Supabase SQL Editor:');
      console.log('---');
      console.log(sql);
      console.log('---');
      console.log('\nGo to: https://supabase.com/dashboard/project/dexforbcexbhhdnymapc/sql/new');
    } else {
      console.log('Migration completed successfully!');
    }
  } catch (err) {
    console.error('Migration error:', err.message);
    console.log('\nPlease run this SQL manually in the Supabase SQL Editor:');
    console.log('---');
    console.log(sql);
    console.log('---');
  }
}

runMigration();
