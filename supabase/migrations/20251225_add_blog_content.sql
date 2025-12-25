-- Add blog_content field for full story content
-- The existing 'story' field will remain as a short excerpt/description
-- 'blog_content' stores the full markdown blog post that appears before recipe cards

ALTER TABLE recipes ADD COLUMN IF NOT EXISTS blog_content TEXT;

-- Add comment explaining the difference
COMMENT ON COLUMN recipes.story IS 'Short excerpt/summary for recipe cards and previews';
COMMENT ON COLUMN recipes.blog_content IS 'Full markdown blog post content displayed before recipe card';
