# Telegram Bot Specification

## Overview

A Telegram bot that accepts recipe submissions and automatically:
1. Parses the recipe content
2. Rewrites it in EasyToCookMeals brand voice
3. Generates blogger-style images
4. Creates a draft recipe in the admin dashboard

---

## Bot Commands

### /start
Welcome message with instructions

### /submit
Start recipe submission flow

### /status <id>
Check processing status of a submitted recipe

### /help
Show available commands and usage

---

## Submission Flow

```
User sends recipe (text, URL, or Instagram link)
              ↓
Bot acknowledges: "Processing your recipe..."
              ↓
┌─────────────────────────────────────────────┐
│            PARSING PHASE                     │
├─────────────────────────────────────────────┤
│ IF text: Extract recipe structure           │
│ IF URL: Scrape webpage for recipe data      │
│ IF Instagram: Scrape post + OCR if needed   │
└─────────────────────────────────────────────┘
              ↓
Bot confirms: "Found: [Recipe Title] with [X] ingredients"
              ↓
┌─────────────────────────────────────────────┐
│            AI REWRITE PHASE                  │
├─────────────────────────────────────────────┤
│ • Generate engaging intro story             │
│ • Format ingredients with notes             │
│ • Rewrite instructions in brand voice       │
│ • Add tips and notes section                │
└─────────────────────────────────────────────┘
              ↓
Bot updates: "Rewriting in EasyToCookMeals style..."
              ↓
┌─────────────────────────────────────────────┐
│          IMAGE GENERATION PHASE              │
├─────────────────────────────────────────────┤
│ • Select random style variation (1-6)       │
│ • Generate 2-3 image options                │
│ • Store in Supabase storage                 │
└─────────────────────────────────────────────┘
              ↓
Bot updates: "Generating beautiful food images..."
              ↓
┌─────────────────────────────────────────────┐
│           SAVE & NOTIFY PHASE                │
├─────────────────────────────────────────────┤
│ • Create draft recipe in database           │
│ • Link generated images                     │
│ • Notify admin channel                      │
└─────────────────────────────────────────────┘
              ↓
Bot sends: "✅ Recipe draft created! Preview: [link]"
           + Image preview
           + Quick actions: [Edit] [Publish] [Regenerate Image]
```

---

## Input Handling

### Plain Text Recipe
```
User pastes:
"Chickpea Curry
Ingredients:
- 1 can chickpeas
- 1 can coconut milk
- 2 tbsp curry powder
..."

Bot extracts structure using regex/NLP
```

### Recipe URL
```
User sends: https://somerecipe.com/vegan-curry

Bot uses recipe-scrapers library (Python) or Cheerio (Node)
to extract structured data from JSON-LD schema
```

### Instagram Link
```
User sends: https://www.instagram.com/p/ABC123/

Bot:
1. Fetches post via Instagram Graph API or unofficial scraper
2. Extracts caption for recipe text
3. If recipe is in image (screenshot), uses OCR
4. Downloads original images for reference
```

---

## Technical Architecture

### Bot Server (Separate from Main App)
```
bot/
├── src/
│   ├── index.ts              # Bot entry point
│   ├── handlers/
│   │   ├── start.ts
│   │   ├── submit.ts
│   │   ├── status.ts
│   │   └── callback.ts       # Inline button handlers
│   ├── services/
│   │   ├── parser.ts         # Recipe parsing
│   │   ├── scraper.ts        # URL scraping
│   │   ├── instagram.ts      # Instagram handling
│   │   ├── rewriter.ts       # AI rewriting (Claude API)
│   │   └── imageGen.ts       # Image generation (fal.ai)
│   ├── utils/
│   │   └── supabase.ts       # Database client
│   └── types/
│       └── recipe.ts
├── package.json
└── .env
```

### Dependencies
```json
{
  "dependencies": {
    "telegraf": "^4.16.0",
    "@anthropic-ai/sdk": "^0.27.0",
    "@supabase/supabase-js": "^2.0.0",
    "cheerio": "^1.0.0",
    "recipe-scrapers": "^0.5.0"
  }
}
```

### Environment Variables
```
TELEGRAM_BOT_TOKEN=xxx
TELEGRAM_ADMIN_CHAT_ID=xxx
ANTHROPIC_API_KEY=xxx
FAL_API_KEY=xxx
SUPABASE_URL=xxx
SUPABASE_ANON_KEY=xxx
```

---

## Database Integration

### Recipe Draft Table
```sql
-- Extend recipes table with submission tracking
ALTER TABLE recipes ADD COLUMN submission_source VARCHAR(50);
-- 'telegram', 'instagram', 'manual'

ALTER TABLE recipes ADD COLUMN original_url TEXT;
ALTER TABLE recipes ADD COLUMN telegram_chat_id BIGINT;
ALTER TABLE recipes ADD COLUMN processing_status VARCHAR(20);
-- 'pending', 'parsing', 'rewriting', 'generating_images', 'complete', 'failed'
```

### Submission Log
```sql
CREATE TABLE recipe_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_chat_id BIGINT NOT NULL,
  telegram_message_id BIGINT,
  input_type VARCHAR(20), -- 'text', 'url', 'instagram'
  input_content TEXT,
  recipe_id UUID REFERENCES recipes(id),
  status VARCHAR(20) DEFAULT 'pending',
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  processed_at TIMESTAMP
);
```

---

## Admin Notifications

When a recipe is submitted, notify admin channel:

```
📩 New Recipe Submission

📝 Title: Chickpea Curry
🌍 Source: Telegram paste
👤 Submitted by: @username
⏱ Processing time: 45s

🖼 Generated Images: 3
📊 Confidence: High (structured input)

[Preview Draft] [Edit] [Publish Now] [Reject]
```

---

## Error Handling

### Parsing Failures
```
"❌ I couldn't parse that recipe. Try one of these:

1. Paste the full recipe text with ingredients and instructions
2. Send a link to a recipe page
3. Send an Instagram recipe post link

Need help? Use /help for examples."
```

### Rate Limiting
- Max 5 submissions per user per hour
- Queue system for processing

### Image Generation Failures
- Retry up to 3 times
- Fall back to placeholder image
- Notify user: "Image generation failed. You can add images manually in the admin."

---

## Security Considerations

1. **Whitelist users**: Only allow approved Telegram users to submit
2. **Content moderation**: Check for spam/abuse before processing
3. **Rate limiting**: Prevent API abuse
4. **Sanitize inputs**: Prevent injection attacks in recipe content
5. **GDPR**: Don't store personal Telegram data beyond necessary

---

## Future Enhancements

### Instagram Auto-Import
- Connect Instagram account
- Automatically import saved/bookmarked recipe posts
- Webhook on new saves

### WhatsApp Integration
- Similar bot for WhatsApp users
- Use WhatsApp Business API

### Voice Submissions
- Accept voice messages describing recipe
- Transcribe with Whisper API
- Parse transcription

### Image-to-Recipe
- User uploads photo of handwritten recipe
- OCR extracts text
- Parse into structured format
