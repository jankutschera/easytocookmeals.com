# EasyToCookMeals.com - Project Plan

## Inspiration Reference
Based on analysis of [The Plant Based School](https://theplantbasedschool.com/) - a successful vegan recipe blog run by a husband-wife team (Nico & Louise), similar to our Sandra & Jan positioning.

---

## Phase 1: Recipe Page Enhancements (Priority: High) ✅ COMPLETE

### 1.1 Ingredient Checkboxes ✅
- [x] Add checkbox to each ingredient in the list
- [x] Persist checked state during session
- [x] Visual strikethrough for checked items
- [x] Progress indicator ("3 of 8 checked")

### 1.2 Instruction Step Checkboxes ✅
- [x] Add checkbox to each instruction step
- [x] Visual indicator for completed steps (green checkmark)
- [x] "Next step" highlighting
- [x] "Recipe Complete!" celebration animation

### 1.3 Cook Mode with Timer ✅
- [x] "Start Cooking" button in recipe card
- [x] Full-screen cook mode overlay
- [x] Large, readable step text
- [x] Step navigation (prev/next) + keyboard shortcuts
- [x] Built-in timer with presets (1-30 min)
- [x] Wake lock to prevent screen sleep
- [x] Audio notification when timer completes

### 1.4 User Ratings (No Comments) ✅
- [x] 5-star interactive rating
- [x] Hover effects and click-to-rate
- [x] API endpoint (`/api/ratings`)
- [x] Show average rating + count
- [x] "Thanks for rating!" feedback

---

## Phase 2: Author Attribution & Branding

### 2.1 "Tested by Sandra & Jan" Attribution ✅
- [x] Add attribution line to all recipe pages
- [x] Dual avatar display with emoji placeholders
- [x] "Tested by Sandra & Jan" + "From our kitchen in Cyprus"
- [x] Consistent placement below breadcrumbs, before recipe meta

### 2.2 Benefit-Focused Recipe Titles
Review and update existing recipe titles to emphasize benefits:

| Recipe Slug | Current Title | Suggested Title |
|-------------|---------------|-----------------|
| vegan-mozzarella | Vegan Mozzarella | Easy Vegan Mozzarella (Melts Perfectly!) |
| vegan-raclette-cheese | Vegan Raclette Cheese | Homemade Vegan Raclette (Fondue-Ready in 30 Min) |
| overnight-oatmeal | Overnight Oatmeal | 5-Minute Prep Overnight Oats (Grab & Go) |
| vegan-oreos | Vegan Oreos | Homemade Vegan Oreos (Healthier & Delicious) |
| dinner-rolls | Vegan Dinner Rolls | Fluffy Vegan Dinner Rolls (Better Than Bakery) |
| vegan-asian-beef-broccoli | Vegan Asian Beef with Broccoli | Quick Vegan Beef & Broccoli (Crock Pot Magic) |
| vegan-turkey-pasta-sauce | Vegan Turkey Pasta Sauce | Hearty Vegan Pasta Sauce (Italian Comfort) |
| vegan-sweet-potato-plantain-bowl | Vegan Sweet Potato Plantain Bowl | 30-Minute Sweet Potato & Plantain Power Bowl |
| zucchini-carrot-crustless-pizza | Zucchini Carrot Crustless Pizza | Low-Carb Veggie Pizza (No Crust Needed!) |
| authentic-falafel | Authentic Falafel | Crispy Homemade Falafel (Street Food at Home) |
| tropical-coconut-chia-pudding | Tropical Coconut Chia Pudding | Make-Ahead Tropical Chia Pudding (Meal Prep Hero) |
| watermelon-kiwi-smoothie | Watermelon Kiwi Smoothie | Refreshing Watermelon Kiwi Smoothie (5 Ingredients) |

**SQL to update titles (run in Supabase SQL Editor):**
```sql
UPDATE recipes SET title = 'Easy Vegan Mozzarella (Melts Perfectly!)' WHERE slug = 'vegan-mozzarella';
UPDATE recipes SET title = 'Homemade Vegan Raclette (Fondue-Ready in 30 Min)' WHERE slug = 'vegan-raclette-cheese';
UPDATE recipes SET title = '5-Minute Prep Overnight Oats (Grab & Go)' WHERE slug = 'overnight-oatmeal';
UPDATE recipes SET title = 'Homemade Vegan Oreos (Healthier & Delicious)' WHERE slug = 'vegan-oreos';
UPDATE recipes SET title = 'Fluffy Vegan Dinner Rolls (Better Than Bakery)' WHERE slug = 'dinner-rolls';
UPDATE recipes SET title = 'Quick Vegan Beef & Broccoli (Crock Pot Magic)' WHERE slug = 'vegan-asian-beef-broccoli';
UPDATE recipes SET title = 'Hearty Vegan Pasta Sauce (Italian Comfort)' WHERE slug = 'vegan-turkey-pasta-sauce';
UPDATE recipes SET title = '30-Minute Sweet Potato & Plantain Power Bowl' WHERE slug = 'vegan-sweet-potato-plantain-bowl';
UPDATE recipes SET title = 'Low-Carb Veggie Pizza (No Crust Needed!)' WHERE slug = 'zucchini-carrot-crustless-pizza';
UPDATE recipes SET title = 'Crispy Homemade Falafel (Street Food at Home)' WHERE slug = 'authentic-falafel';
UPDATE recipes SET title = 'Make-Ahead Tropical Chia Pudding (Meal Prep Hero)' WHERE slug = 'tropical-coconut-chia-pudding';
UPDATE recipes SET title = 'Refreshing Watermelon Kiwi Smoothie (5 Ingredients)' WHERE slug = 'watermelon-kiwi-smoothie';
```

- [ ] Run SQL in Supabase Dashboard to update titles
- [ ] Update meta descriptions for SEO
- [ ] Ensure slugs remain unchanged for SEO

---

## Phase 3: Recipe Collections (Future - When 20+ Recipes)

### 3.1 Collection Pages
Create themed recipe roundup pages:

**By Ingredient:**
- [ ] "Vegan Cheese Recipes" (mozzarella, raclette, parmesan, cream cheese)
- [ ] "Tofu & Tempeh Recipes"
- [ ] "Oat-Based Recipes"

**By Meal Type:**
- [ ] "Quick Breakfast Ideas"
- [ ] "Easy Weeknight Dinners"
- [ ] "Impressive Weekend Recipes"

**By Cooking Method:**
- [ ] "No-Cook Recipes"
- [ ] "One-Pan Wonders"
- [ ] "30-Minute Meals"

**By Occasion:**
- [ ] "Recipes That Impress Meat-Eaters"
- [ ] "Holiday & Party Food"
- [ ] "Meal Prep Favorites"

### 3.2 Collection Page Features
- [ ] Hero image with collection title
- [ ] Short intro paragraph
- [ ] Grid of recipe cards
- [ ] Filter by prep time, difficulty
- [ ] SEO-optimized meta descriptions

---

## Phase 4: Future Enhancements

### 4.1 User Features (Requires Auth)
- [ ] Save favorite recipes
- [ ] Personal recipe notes
- [ ] Meal planning calendar
- [ ] Shopping list generator

### 4.2 Content Expansion
- [ ] Recipe video integration
- [ ] Step-by-step photos
- [ ] Substitution suggestions
- [ ] Nutrition information display

### 4.3 SEO & Discovery
- [ ] Recipe schema markup (JSON-LD) - already have
- [ ] Pinterest-optimized images
- [ ] Related recipes section
- [ ] "You might also like" recommendations

---

## Current Recipe Inventory (12 recipes)

1. Vegan Mozzarella
2. Vegan Raclette Cheese
3. Vegan Parmesan
4. Vegan Cream Cheese
5. Overnight Oatmeal
6. Vegan Oreos
7. Shakshuka
8. Vietnamese Spring Rolls
9. Banana Bread
10. Pad Thai
11. Buddha Bowl
12. Mushroom Risotto

**Target for Collections:** 20+ recipes

---

## Technical Notes

- **State Persistence:** Use localStorage for checkboxes during cooking session
- **Ratings Storage:** New Supabase table `recipe_ratings`
- **Cook Mode:** Consider using Web Locks API for screen wake lock
- **Timer:** Use Web Audio API for timer sounds

---

## Timeline

| Phase | Status | Notes |
|-------|--------|-------|
| Phase 1.1 | ✅ Complete | Ingredient checkboxes with progress |
| Phase 1.2 | ✅ Complete | Step checkboxes with celebration |
| Phase 1.3 | ✅ Complete | Cook mode + timer + wake lock |
| Phase 1.4 | ✅ Complete | User ratings with API |
| Phase 2.1 | ✅ Complete | Sandra & Jan attribution |
| Phase 2.2 | ✅ Complete | 12 titles updated in Supabase |
| Phase 3 | ⏳ Future | Need more recipes first |

---

*Last updated: 2025-12-25*
