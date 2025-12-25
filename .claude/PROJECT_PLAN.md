# Easy to Cook Meals - Project Plan

## Project Overview
Relaunch of easytocookmeals.com - a vegan recipe blog by Nora (Israeli digital nomad chef)
- Migrating from WordPress + WP Recipe Maker to custom Next.js platform
- Using TrueBrew Birdie frontend-design-system plugin
- Using copythinking-skills plugin for copy

---

## Phase 1: Core Infrastructure [COMPLETED]
- [x] Set up Next.js 14 with TypeScript
- [x] Configure Supabase database (recipes, ingredients, instructions, nutrition)
- [x] Set up TrueBrew design system (Tailwind config, CSS variables, fonts)
- [x] Create shared Header/Footer components with logo
- [x] Import 12 recipes from WordPress

## Phase 2: Content Migration [MOSTLY COMPLETE]
### Recipe Content
- [x] Import basic recipe data (title, ingredients, instructions, nutrition)
- [x] Download featured images for all 12 recipes
- [x] **Get FULL story content from each WordPress recipe page** (stored in data/blog-content.json)
- [x] **Integrate blog content into recipe detail pages** (with drop-cap, headings, paragraphs)
- [ ] **Download additional images within recipe stories** (optional)
- [ ] **Analyze original WordPress pages for missing elements** (optional)

### Recipe Pages Content Status:
| Recipe | WordPress URL | Blog Content |
|--------|---------------|--------------|
| vegan-mozzarella | /vegan-mozarella/ | ✅ DONE |
| authentic-falafel | /authentic-falafel/ | ✅ DONE |
| overnight-oatmeal | /on-the-go-breakfast-overnight-oatmeal/ | ✅ DONE |
| vegan-oreos | /healthy-vegan-oreos/ | ✅ DONE |
| tropical-coconut-chia-pudding | /tropical-coconut-chia-pudding/ | ✅ DONE |
| watermelon-kiwi-smoothie | /watermelon-kiwi-smoothie/ | ✅ DONE |
| dinner-rolls | /dinner-rolls/ | ✅ DONE |
| vegan-turkey-pasta-sauce | /powered-hearty-pasta-sauce-the-vegan-turkey/ | ✅ DONE |
| vegan-asian-beef-broccoli | /skinny-crock-pot-vegan-asian-beef-with-broccoli/ | ✅ DONE |
| vegan-raclette-cheese | /vegan-raclette-cheese/ | ✅ DONE |
| vegan-sweet-potato-plantain-bowl | /vegan-sweet-potato-plantain-bowl/ | ✅ DONE |
| zucchini-carrot-crustless-pizza | /zucchini-carrot-crustless-pizza/ | ✅ DONE |

## Phase 3: Design & UX [IN PROGRESS]
- [x] Apply TrueBrew design system to homepage
- [x] Apply TrueBrew design system to /recipes listing
- [x] Apply TrueBrew design system to recipe detail pages
- [x] Create cuisine category pages
- [x] Update homepage with Nora's profile image (instead of icon)
- [x] Replace Instagram section with Recipe Gallery
- [ ] **Design review: Compare with original WordPress for missing elements**

## Phase 4: URL Preservation (SEO) [COMPLETED]
Important for preserving backlinks from original site.

### Redirects Configured in next.config.mjs:
| Old URL | New URL | Status |
|---------|---------|--------|
| /cunning-ladies-friday-party/ | / (homepage) | ✅ DONE |
| /healthy-vegan-oreos/ | /recipe/vegan-oreos | ✅ DONE |
| /vegan-mozarella/ | /recipe/vegan-mozzarella | ✅ DONE |
| /on-the-go-breakfast-overnight-oatmeal/ | /recipe/overnight-oatmeal | ✅ DONE |

## Phase 5: Functionality [IN PROGRESS]
### Newsletter
- [x] Create newsletter_subscribers table migration (20251225_newsletter.sql)
- [x] Create newsletter API endpoint (/api/newsletter/route.ts)
- [ ] Run migration in Supabase production
- [ ] Connect newsletter form component to API
- [ ] Add success/error states to form

### Other Features
- [x] Recipe ratings system
- [x] Servings adjuster
- [x] Unit toggle (metric/imperial)
- [x] Print recipe functionality
- [ ] Search functionality
- [ ] Recipe bookmarks/favorites

## Phase 6: Testing & Launch [TODO]
- [ ] Cross-browser testing
- [ ] Mobile responsiveness check
- [ ] Performance optimization
- [ ] SEO meta tags verification
- [ ] Structured data (JSON-LD) verification
- [ ] Final content review

---

## Current Sprint Tasks

### Completed:
1. [x] Update homepage with Nora's profile image
2. [x] Replace Instagram section with Recipe Gallery
3. [x] Create newsletter migration + API endpoint
4. [x] Create redirects for old URLs (cunning-ladies, vegan-oreos, etc.)
5. [x] Extract FULL story content from all 12 WordPress recipes
6. [x] Create blog-content.json with all stories
7. [x] Integrate blog content into recipe detail pages
8. [x] Create blog_content migration SQL

### Completed (Design Review):
9. [x] Design review completed - identified color system issues
10. [x] Fixed recipe card colors (coral/cream -> terracotta/sand)
11. [x] Added cuisine-to-city location mappings (Austrian->Vienna, Vietnamese->Hanoi, etc.)
12. [x] Fixed BackToTopButton colors

### Next:
- Run newsletter migration in Supabase production
- Run blog_content migration in Supabase production
- Connect newsletter form to API
- Download additional recipe images (optional)

---

## Agent Assignments

| Task | Agent Type | Status |
|------|------------|--------|
| Analyze original recipe pages | Explore | PENDING |
| Apply design system review | design-review | PENDING |
| Code review | code-reviewer | PENDING |

---

## Notes
- No Instagram account exists for @easytocookmeals - removed Instagram section
- Most backlinks point to: /cunning-ladies-friday-party/ - must preserve this URL
- All recipe images downloaded to /public/images/recipes/[slug]/featured.*
- Logo at /public/images/brand/logo.png
- Nora's photo at /public/images/brand/nora.png
