# EasyToCookMeals.com - Custom Recipe Platform

## Project Overview

Replace WordPress + WP Recipe Maker with a custom Next.js solution that provides:
- Full recipe management with SEO optimization
- Telegram/Instagram bot for automated recipe ingestion
- AI-powered content rewriting in brand voice
- Blogger-style image generation (not professional food photography)

## Brand Identity (from current site)

- **Target Audience**: Home cooks seeking accessible, plant-based recipes
- **Tone**: Friendly, personal, experiential, travel-inspired storytelling
- **Visual Style**:
  - Colors: Cream (#fbf4ed), Coral accent (#fb6a4a), warm earth tones
  - Fonts: Karla (headings), Raleway (body)
  - Images: Natural lighting, lifestyle feel, NOT professional food photography
- **Content Focus**: Vegan/plant-based with global influences

## Tech Stack

```
Frontend:     Next.js 14 (App Router) + TypeScript + Tailwind CSS
Database:     Supabase (PostgreSQL + Auth + Storage)
Image Gen:    fal.ai (FLUX.2 + Nano Banana Pro)
AI/LLM:       Claude API (content rewriting)
Bot:          Telegram Bot API + Instagram Graph API
Hosting:      Vercel
```

## Core Features to Replicate from WP Recipe Maker

### Recipe Card Features
- [x] Structured recipe display (prep/cook/total time, servings)
- [x] Ingredient groups with quantities
- [x] Step-by-step instructions
- [x] Adjustable servings (recalculates ingredients)
- [x] Unit conversion (metric/imperial)
- [x] Temperature conversion
- [x] Print-friendly format
- [x] Jump to recipe button
- [x] User ratings & reviews
- [x] Nutrition facts label
- [x] Equipment list
- [x] Recipe notes section

### SEO Features
- [x] JSON-LD structured data (Recipe schema)
- [x] Open Graph meta tags
- [x] Automatic sitemap
- [x] Pinterest-optimized images

### Admin Features
- [x] Recipe editor with live preview
- [x] Bulk import/export
- [x] Recipe collections/categories
- [x] Draft/publish workflow

## Database Schema

```sql
-- Core recipe table
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  story TEXT, -- Personal narrative intro

  -- Timing
  prep_time_minutes INT,
  cook_time_minutes INT,
  rest_time_minutes INT,

  -- Servings
  servings INT DEFAULT 4,
  servings_unit VARCHAR(50) DEFAULT 'servings',

  -- Categorization
  cuisine VARCHAR(100)[],
  course VARCHAR(100)[],
  keywords VARCHAR(100)[],

  -- Media
  featured_image_url TEXT,
  pinterest_image_url TEXT,
  gallery_urls TEXT[],

  -- SEO
  meta_title VARCHAR(60),
  meta_description VARCHAR(160),

  -- Status
  status VARCHAR(20) DEFAULT 'draft', -- draft, published, archived
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Ingredient groups (e.g., "For the sauce", "For the base")
CREATE TABLE ingredient_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  title VARCHAR(255),
  sort_order INT DEFAULT 0
);

-- Individual ingredients
CREATE TABLE ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES ingredient_groups(id) ON DELETE CASCADE,
  amount DECIMAL(10,3),
  unit VARCHAR(50),
  name VARCHAR(255) NOT NULL,
  notes VARCHAR(255), -- e.g., "finely chopped"
  sort_order INT DEFAULT 0
);

-- Instruction steps
CREATE TABLE instructions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  step_number INT NOT NULL,
  text TEXT NOT NULL,
  image_url TEXT,
  tip TEXT -- Optional tip for this step
);

-- Nutrition facts
CREATE TABLE nutrition (
  recipe_id UUID PRIMARY KEY REFERENCES recipes(id) ON DELETE CASCADE,
  calories INT,
  carbs_g DECIMAL(10,1),
  protein_g DECIMAL(10,1),
  fat_g DECIMAL(10,1),
  saturated_fat_g DECIMAL(10,1),
  fiber_g DECIMAL(10,1),
  sugar_g DECIMAL(10,1),
  sodium_mg INT,
  -- Extended nutrition
  vitamin_a_iu INT,
  vitamin_c_mg INT,
  calcium_mg INT,
  iron_mg DECIMAL(10,1),
  potassium_mg INT
);

-- Equipment needed
CREATE TABLE equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  affiliate_url TEXT
);

-- User ratings
CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  user_id UUID,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Image Generation Strategy

### Goal: Blogger-style, NOT professional food photography

Generate images that look like:
- Taken with an iPhone in natural light
- Casual home kitchen setting
- Slightly imperfect styling (not over-styled)
- Warm, inviting, lived-in feel
- Variety in angles, settings, props

### Style Variations (rotate between)
1. **Kitchen Counter** - Recipe on cutting board, ingredients scattered
2. **Table Setting** - Plated dish with napkin, fork, partial view
3. **Hands in Frame** - Someone holding bowl or reaching for food
4. **Process Shot** - Mid-cooking, ingredients in pan
5. **Window Light** - Moody, soft natural light from side
6. **Outdoor** - Patio table, garden background

### Prompt Template for Nano Banana Pro
```
[Context]: For a personal food blog, casual home cooking aesthetic.
[Subject]: {dish_name} in {setting}.
[Style]: iPhone photography, lifestyle food blog, NOT professional food photography.
[Lighting]: Natural {light_type} light, warm tones.
[Mood]: Inviting, homemade, approachable.
[Imperfections]: Slightly messy, real kitchen, lived-in.
```

## Telegram Bot Flow

```
User pastes recipe URL or text
    ↓
Bot extracts recipe data (scraping or parsing)
    ↓
AI rewrites in brand voice (travel story intro, conversational instructions)
    ↓
Generate blogger-style image
    ↓
Create draft recipe in admin
    ↓
Notify user with preview link
```

## Instagram Integration

```
User saves/bookmarks Instagram recipe post
    ↓
Webhook triggers scraping
    ↓
Extract recipe from post (OCR if needed)
    ↓
Same pipeline as Telegram
```

## File Structure

```
easytocookmeals.com/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (public)/          # Public routes
│   │   │   ├── page.tsx       # Homepage
│   │   │   ├── recipes/       # Recipe listing
│   │   │   └── [slug]/        # Individual recipe
│   │   ├── admin/             # Admin dashboard
│   │   │   ├── recipes/       # Recipe management
│   │   │   └── settings/      # Site settings
│   │   └── api/               # API routes
│   │       ├── recipes/       # Recipe CRUD
│   │       ├── telegram/      # Telegram webhook
│   │       └── generate-image/# Image generation
│   ├── components/
│   │   ├── recipe/            # Recipe components
│   │   │   ├── RecipeCard.tsx
│   │   │   ├── IngredientList.tsx
│   │   │   ├── Instructions.tsx
│   │   │   ├── NutritionLabel.tsx
│   │   │   ├── ServingsAdjuster.tsx
│   │   │   └── PrintView.tsx
│   │   ├── ui/                # Shared UI components
│   │   └── layout/            # Layout components
│   ├── lib/
│   │   ├── supabase.ts        # Database client
│   │   ├── recipe-parser.ts   # Parse recipe text/URLs
│   │   ├── ai-rewriter.ts     # Claude API for rewriting
│   │   ├── image-generator.ts # fal.ai integration
│   │   └── unit-converter.ts  # Metric/imperial conversion
│   └── types/
│       └── recipe.ts          # TypeScript types
├── bot/
│   └── telegram/              # Telegram bot (separate service)
└── scripts/
    └── migrate-recipes.ts     # Import from WordPress
```

## Phase 1: MVP (Week 1-2)
- [ ] Next.js project setup with Tailwind
- [ ] Supabase database setup
- [ ] Recipe card component (display only)
- [ ] Basic recipe listing page
- [ ] JSON-LD schema implementation

## Phase 2: Core Features (Week 3-4)
- [ ] Adjustable servings
- [ ] Unit conversion
- [ ] Print view
- [ ] User ratings
- [ ] Admin recipe editor

## Phase 3: Automation (Week 5-6)
- [ ] Telegram bot
- [ ] AI recipe rewriter
- [ ] Image generation pipeline
- [ ] Instagram integration (stretch)

## Phase 4: Polish (Week 7-8)
- [ ] Migration from WordPress
- [ ] SEO optimization
- [ ] Performance tuning
- [ ] Launch
