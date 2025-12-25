# TrueBrew Birdie Marketplace Plugins for EasyToCookMeals.com

## Available Plugins Summary

| Plugin | Purpose | Relevance |
|--------|---------|-----------|
| nano-banana-pro | AI Image Generation | HIGH - Blogger-style food photos |
| copythinking-skills | Content Writing & Hooks | HIGH - Recipe intros & marketing |
| dominant-guide-content | SEO & Content Strategy | HIGH - Recipe SEO optimization |
| frontend-design-system | UI/UX Design | HIGH - Recipe card components |
| amazon-kdp-seo | Book SEO | LOW - Only if creating cookbook |

---

## 1. nano-banana-pro - Image Generation

**Perfect for generating blogger-style recipe images**

### Commands
- `/nano-product` - Product photography (recipe hero shots)
- `/nano-story` - Instagram Story content
- `/nano-infographic` - Recipe infographics
- `/nano-vintage` - 70s Polaroid aesthetic
- `/nano-cinematic` - Movie-style shots

### Example for Recipe Images
```
/nano-product "A vibrant plant-based curry on a cream ceramic plate,
placed on a rustic wooden table with scattered herbs. Natural afternoon
sunlight from the side. Warm, inviting food blog aesthetic. NOT professional
food photography - casual iPhone-style home cooking vibe."
```

---

## 2. copythinking-skills - Content Writing

**For engaging recipe intros and marketing copy**

### Commands
- `/write-hook` - Generate 10 compelling hook options
- `/analyze-copy` - Check copy for conversion issues
- `/awareness-check` - Determine audience awareness level

### Skills
- `copythinking-tactical` - 19 bullet formulas, storytelling
- `hook-creator` - Headlines and attention grabbers
- `copy-quality-frameworks` - Quality review

### Example for Recipe Intros
```
/write-hook "recipe introduction" "home cooks seeking plant-based meals"
```

---

## 3. dominant-guide-content - SEO Strategy

**For recipe SEO optimization and content planning**

### Skills
- `article-writer` - SEO-optimized content
- `competitor-monitor` - Track competing recipe blogs
- `content-strategist` - Plan content calendars

### Agents
- SEO Researcher - Keyword research
- Content Planner - Strategy mapping

---

## 4. frontend-design-system - UI Components

**For building recipe card components and UI**

### Skill
- `truebrewbirdie-design` - Tailwind/HTML generation

### Features
- 50 curated fonts
- Motion library
- Social media templates
- Non-generic design patterns

---

## Installation

```bash
claude plugins install copythinking-skills@truebrewbirdie-marketplace
claude plugins install nano-banana-pro@truebrewbirdie-marketplace
claude plugins install dominant-guide-content@truebrewbirdie-marketplace
claude plugins install frontend-design-system@truebrewbirdie-marketplace
```

---

## Implementation Workflow

1. **Recipe Content** → copythinking-skills for engaging intro
2. **Recipe Image** → nano-banana-pro for lifestyle photo
3. **Recipe SEO** → dominant-guide-content for optimization
4. **Recipe UI** → frontend-design-system for beautiful cards
