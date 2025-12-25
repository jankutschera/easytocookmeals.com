# Blogger-Style Food Image Generation

## Core Philosophy

Generate images that look like a home cook took them with their iPhone - NOT professional food photography. The goal is authentic, relatable, lifestyle food imagery.

## Anti-Patterns (AVOID)
- Pure white backgrounds
- Perfect symmetry
- Overhead flat-lays with geometric arrangements
- Studio lighting
- Pristine, styled-to-perfection plates
- Stock photo aesthetic
- Professional food styling (garnish tweezers, etc.)

## Target Aesthetic
- Natural daylight (window light, patio light)
- Slightly imperfect styling
- Real kitchen/dining environments
- Warm, lived-in feeling
- Person partially in frame (hands, reaching)
- Casual table settings
- Some mess is okay (crumbs, drips)

---

## Style Variations (Rotate Between)

### 1. Kitchen Counter Shot
```
[Context]: Personal food blog, casual home cooking.
[Subject]: {dish_name} on a wooden cutting board, surrounded by scattered fresh ingredients and cooking remnants.
[Setting]: Modern home kitchen counter, morning light from window.
[Style]: iPhone photography, lifestyle food blog, candid cooking moment.
[Details]: Some flour dust, herb stems, partial knife in frame.
[Mood]: Authentic, homemade, in-progress cooking.
```

### 2. Table Setting
```
[Context]: Cozy dinner at home, food blog aesthetic.
[Subject]: {dish_name} plated on ceramic dish, partial place setting visible.
[Setting]: Rustic wooden dining table, linen napkin, simple cutlery.
[Style]: Lifestyle photography, warm and inviting, natural imperfection.
[Lighting]: Warm evening light, candle glow optional.
[Details]: Wine glass edge, bread basket corner, lived-in table.
```

### 3. Hands in Frame
```
[Context]: Someone enjoying homemade food, personal blog.
[Subject]: Hands holding or reaching for {dish_name}.
[Setting]: Kitchen or dining area, casual environment.
[Style]: Lifestyle food photography, authentic moment, candid.
[Details]: Partial sweater sleeve, natural hand position, real person feel.
[Mood]: Intimate, approachable, sharing food.
```

### 4. Process Shot
```
[Context]: Behind-the-scenes cooking, food blog.
[Subject]: {dish_name} mid-preparation in pan or mixing bowl.
[Setting]: Home stovetop or counter, cooking in action.
[Style]: Documentary cooking style, authentic process.
[Details]: Steam rising, sauce bubbling, ingredients being added.
[Mood]: Active cooking, real kitchen moment.
```

### 5. Window Light Portrait
```
[Context]: Moody food photography, home cook blog.
[Subject]: {dish_name} placed near window, dramatic natural light.
[Setting]: Near window, soft shadows, vintage plate or bowl.
[Style]: Editorial-lite, atmospheric but accessible.
[Lighting]: Strong side light from window, soft shadows.
[Mood]: Contemplative, artistic but not pretentious.
```

### 6. Outdoor/Patio
```
[Context]: Al fresco dining, lifestyle food blog.
[Subject]: {dish_name} on outdoor table, garden visible.
[Setting]: Patio or garden table, natural greenery background.
[Style]: Summer lifestyle, relaxed outdoor dining.
[Details]: Dappled sunlight, plants in background, casual setting.
[Mood]: Fresh, seasonal, connection to nature.
```

---

## Color Palette Guidance

Match the EasyToCookMeals brand:
- Warm earth tones
- Cream/off-white backgrounds (not pure white)
- Coral/terracotta accents
- Natural wood tones
- Muted sage greens
- Soft golden lighting

Hex references:
- Background: #fbf4ed (warm cream)
- Accent: #fb6a4a (coral)
- Wood: #8B7355 (warm brown)
- Greens: #9CAF88 (sage)

---

## Technical Parameters

### For Nano Banana Pro (Preferred)
```
model: fal-ai/nano-banana-pro
image_size: landscape_16_9 (for featured images)
           square (for Pinterest)
           portrait_4_3 (for recipe cards)
```

### For FLUX.2 (Alternative)
```
model: fal-ai/flux-2-pro
image_size: landscape_16_9
```

FLUX.2 JSON structure:
```json
{
  "scene": "Home kitchen counter with morning light",
  "subjects": [{
    "description": "{dish_name} on ceramic plate",
    "position": "center-left, slightly angled",
    "details": "steam rising, fresh herbs garnish"
  }],
  "style": "iPhone food photography, lifestyle blog",
  "color_palette": ["#fbf4ed", "#fb6a4a", "#8B7355"],
  "lighting": "Natural window light from right, warm tone",
  "camera": {
    "angle": "45 degrees from above",
    "lens": "35mm equivalent",
    "depth_of_field": "shallow, background slightly blurred"
  },
  "imperfections": "slight crumbs on surface, napkin casually placed"
}
```

---

## Dish-Specific Adjustments

### Bowls & Buddha Bowls
- Overhead angle okay (shows ingredients)
- Include chopsticks or spoon
- Colorful ingredients should pop

### Baked Goods
- Show texture (cracks, crumb structure)
- Stack or break one to show interior
- Cooling rack or parchment paper

### Soups & Stews
- Steam is essential
- Rustic bowl, crusty bread nearby
- Spoon creating ripple

### Salads
- Fresh, vibrant colors
- Just-tossed appearance
- Vinaigrette drizzle visible

### Desserts
- Slight indulgence moment
- Fork having taken a bite
- Coffee cup in background

---

## Implementation Notes

When generating images:
1. Randomly select a style variation (1-6)
2. Customize prompt with dish name
3. Add dish-specific adjustments
4. Generate 2-3 variations
5. Human selects best fit

For each recipe, generate:
- 1 featured hero image (landscape_16_9)
- 1 Pinterest-optimized image (portrait or square)
- 2-3 process/step images (optional)
