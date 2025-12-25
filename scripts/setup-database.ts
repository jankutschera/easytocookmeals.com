import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
});

const schema = `
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Core recipe table
CREATE TABLE IF NOT EXISTS recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  story TEXT,

  -- Timing (in minutes)
  prep_time_minutes INT,
  cook_time_minutes INT,
  rest_time_minutes INT,

  -- Servings
  servings INT DEFAULT 4,
  servings_unit VARCHAR(50) DEFAULT 'servings',

  -- Categorization
  cuisine TEXT[],
  course TEXT[],
  keywords TEXT[],

  -- Media
  featured_image_url TEXT,
  pinterest_image_url TEXT,
  gallery_urls TEXT[],

  -- SEO
  meta_title VARCHAR(60),
  meta_description VARCHAR(160),

  -- Status
  status VARCHAR(20) DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ingredient groups
CREATE TABLE IF NOT EXISTS ingredient_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  title VARCHAR(255),
  sort_order INT DEFAULT 0
);

-- Ingredients
CREATE TABLE IF NOT EXISTS ingredients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID REFERENCES ingredient_groups(id) ON DELETE CASCADE,
  amount DECIMAL(10,3),
  unit VARCHAR(50),
  name VARCHAR(255) NOT NULL,
  notes VARCHAR(255),
  sort_order INT DEFAULT 0
);

-- Instructions
CREATE TABLE IF NOT EXISTS instructions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  step_number INT NOT NULL,
  text TEXT NOT NULL,
  image_url TEXT,
  tip TEXT
);

-- Nutrition facts
CREATE TABLE IF NOT EXISTS nutrition (
  recipe_id UUID PRIMARY KEY REFERENCES recipes(id) ON DELETE CASCADE,
  serving_size VARCHAR(100),
  calories INT,
  carbs_g DECIMAL(10,1),
  protein_g DECIMAL(10,1),
  fat_g DECIMAL(10,1),
  saturated_fat_g DECIMAL(10,1),
  fiber_g DECIMAL(10,1),
  sugar_g DECIMAL(10,1),
  sodium_mg INT,
  vitamin_a_iu INT,
  vitamin_c_mg INT,
  calcium_mg INT,
  iron_mg DECIMAL(10,1),
  potassium_mg INT
);

-- Equipment
CREATE TABLE IF NOT EXISTS equipment (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  affiliate_url TEXT
);

-- Ratings
CREATE TABLE IF NOT EXISTS ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  user_id UUID,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_recipes_slug ON recipes(slug);
CREATE INDEX IF NOT EXISTS idx_recipes_status ON recipes(status);
CREATE INDEX IF NOT EXISTS idx_recipes_published_at ON recipes(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_ingredient_groups_recipe ON ingredient_groups(recipe_id);
CREATE INDEX IF NOT EXISTS idx_ingredients_group ON ingredients(group_id);
CREATE INDEX IF NOT EXISTS idx_instructions_recipe ON instructions(recipe_id);
CREATE INDEX IF NOT EXISTS idx_ratings_recipe ON ratings(recipe_id);

-- Row Level Security (RLS)
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredient_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructions ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- Public read access for published recipes
CREATE POLICY IF NOT EXISTS "Public can view published recipes" ON recipes
  FOR SELECT USING (status = 'published');

CREATE POLICY IF NOT EXISTS "Public can view ingredient groups" ON ingredient_groups
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM recipes WHERE recipes.id = ingredient_groups.recipe_id AND recipes.status = 'published')
  );

CREATE POLICY IF NOT EXISTS "Public can view ingredients" ON ingredients
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM ingredient_groups ig
      JOIN recipes r ON r.id = ig.recipe_id
      WHERE ig.id = ingredients.group_id AND r.status = 'published'
    )
  );

CREATE POLICY IF NOT EXISTS "Public can view instructions" ON instructions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM recipes WHERE recipes.id = instructions.recipe_id AND recipes.status = 'published')
  );

CREATE POLICY IF NOT EXISTS "Public can view nutrition" ON nutrition
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM recipes WHERE recipes.id = nutrition.recipe_id AND recipes.status = 'published')
  );

CREATE POLICY IF NOT EXISTS "Public can view equipment" ON equipment
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM recipes WHERE recipes.id = equipment.recipe_id AND recipes.status = 'published')
  );

CREATE POLICY IF NOT EXISTS "Public can view ratings" ON ratings
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM recipes WHERE recipes.id = ratings.recipe_id AND recipes.status = 'published')
  );

-- Allow public to insert ratings
CREATE POLICY IF NOT EXISTS "Anyone can rate" ON ratings
  FOR INSERT WITH CHECK (true);
`;

async function setupDatabase() {
  console.log('🚀 Setting up EasyToCookMeals database...\n');

  try {
    // Execute schema
    const { error } = await supabase.rpc('exec_sql', { sql: schema });

    if (error) {
      // If RPC doesn't exist, try direct SQL via REST
      console.log('Trying alternative method...');

      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`,
        },
        body: JSON.stringify({ sql: schema }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
    }

    console.log('✅ Database schema created successfully!\n');

  } catch (err) {
    console.error('❌ Error setting up database:', err);
    console.log('\n📋 Copy the SQL schema above and run it manually in Supabase SQL Editor');
    process.exit(1);
  }
}

setupDatabase();
