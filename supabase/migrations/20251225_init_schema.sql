-- EasyToCookMeals Database Schema
-- Initial migration: Core recipe tables

-- ============================================
-- CORE TABLES
-- ============================================

-- Recipes table
CREATE TABLE IF NOT EXISTS recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

  -- Categorization (arrays for multiple values)
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
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ingredient groups (e.g., "For the sauce", "For the base")
CREATE TABLE IF NOT EXISTS ingredient_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  title VARCHAR(255),
  sort_order INT DEFAULT 0
);

-- Individual ingredients
CREATE TABLE IF NOT EXISTS ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES ingredient_groups(id) ON DELETE CASCADE,
  amount DECIMAL(10,3),
  unit VARCHAR(50),
  name VARCHAR(255) NOT NULL,
  notes VARCHAR(255),
  sort_order INT DEFAULT 0
);

-- Instruction steps
CREATE TABLE IF NOT EXISTS instructions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
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

-- Equipment needed
CREATE TABLE IF NOT EXISTS equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  affiliate_url TEXT
);

-- User ratings
CREATE TABLE IF NOT EXISTS ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  user_id UUID,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_recipes_slug ON recipes(slug);
CREATE INDEX IF NOT EXISTS idx_recipes_status ON recipes(status);
CREATE INDEX IF NOT EXISTS idx_recipes_published_at ON recipes(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_recipes_cuisine ON recipes USING GIN(cuisine);
CREATE INDEX IF NOT EXISTS idx_recipes_course ON recipes USING GIN(course);
CREATE INDEX IF NOT EXISTS idx_recipes_keywords ON recipes USING GIN(keywords);

CREATE INDEX IF NOT EXISTS idx_ingredient_groups_recipe ON ingredient_groups(recipe_id);
CREATE INDEX IF NOT EXISTS idx_ingredient_groups_sort ON ingredient_groups(recipe_id, sort_order);

CREATE INDEX IF NOT EXISTS idx_ingredients_group ON ingredients(group_id);
CREATE INDEX IF NOT EXISTS idx_ingredients_sort ON ingredients(group_id, sort_order);

CREATE INDEX IF NOT EXISTS idx_instructions_recipe ON instructions(recipe_id);
CREATE INDEX IF NOT EXISTS idx_instructions_step ON instructions(recipe_id, step_number);

CREATE INDEX IF NOT EXISTS idx_ratings_recipe ON ratings(recipe_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredient_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructions ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- Public read access for published recipes
CREATE POLICY "Anyone can view published recipes" ON recipes
  FOR SELECT USING (status = 'published');

CREATE POLICY "Anyone can view ingredient groups of published recipes" ON ingredient_groups
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM recipes WHERE recipes.id = ingredient_groups.recipe_id AND recipes.status = 'published')
  );

CREATE POLICY "Anyone can view ingredients of published recipes" ON ingredients
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM ingredient_groups ig
      JOIN recipes r ON r.id = ig.recipe_id
      WHERE ig.id = ingredients.group_id AND r.status = 'published'
    )
  );

CREATE POLICY "Anyone can view instructions of published recipes" ON instructions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM recipes WHERE recipes.id = instructions.recipe_id AND recipes.status = 'published')
  );

CREATE POLICY "Anyone can view nutrition of published recipes" ON nutrition
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM recipes WHERE recipes.id = nutrition.recipe_id AND recipes.status = 'published')
  );

CREATE POLICY "Anyone can view equipment of published recipes" ON equipment
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM recipes WHERE recipes.id = equipment.recipe_id AND recipes.status = 'published')
  );

CREATE POLICY "Anyone can view ratings of published recipes" ON ratings
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM recipes WHERE recipes.id = ratings.recipe_id AND recipes.status = 'published')
  );

-- Allow anyone to submit ratings (for public recipes)
CREATE POLICY "Anyone can submit ratings" ON ratings
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM recipes WHERE recipes.id = ratings.recipe_id AND recipes.status = 'published')
  );

-- Service role has full access (for admin operations)
CREATE POLICY "Service role has full access to recipes" ON recipes
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to ingredient_groups" ON ingredient_groups
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to ingredients" ON ingredients
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to instructions" ON instructions
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to nutrition" ON nutrition
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to equipment" ON equipment
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to ratings" ON ratings
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER recipes_updated_at
  BEFORE UPDATE ON recipes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Function to get recipe with all relations
CREATE OR REPLACE FUNCTION get_recipe_with_relations(recipe_slug TEXT)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'recipe', row_to_json(r.*),
    'ingredient_groups', (
      SELECT json_agg(
        json_build_object(
          'group', row_to_json(ig.*),
          'ingredients', (
            SELECT json_agg(row_to_json(i.*) ORDER BY i.sort_order)
            FROM ingredients i
            WHERE i.group_id = ig.id
          )
        )
        ORDER BY ig.sort_order
      )
      FROM ingredient_groups ig
      WHERE ig.recipe_id = r.id
    ),
    'instructions', (
      SELECT json_agg(row_to_json(ins.*) ORDER BY ins.step_number)
      FROM instructions ins
      WHERE ins.recipe_id = r.id
    ),
    'nutrition', (
      SELECT row_to_json(n.*)
      FROM nutrition n
      WHERE n.recipe_id = r.id
    ),
    'equipment', (
      SELECT json_agg(row_to_json(eq.*))
      FROM equipment eq
      WHERE eq.recipe_id = r.id
    ),
    'average_rating', (
      SELECT ROUND(AVG(rating)::numeric, 1)
      FROM ratings rat
      WHERE rat.recipe_id = r.id
    ),
    'rating_count', (
      SELECT COUNT(*)
      FROM ratings rat
      WHERE rat.recipe_id = r.id
    )
  ) INTO result
  FROM recipes r
  WHERE r.slug = recipe_slug AND r.status = 'published';

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
