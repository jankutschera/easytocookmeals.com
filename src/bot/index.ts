import { Bot, Context, session, SessionFlavor } from 'grammy';
import { scrapeRecipe } from './scraper';
import { rewriteRecipe } from './rewriter';
import { generateRecipeImage } from './image-generator';
import { saveRecipeDraft } from './database';

// Session data interface
interface SessionData {
  awaitingRecipeText: boolean;
  pendingRecipe: any | null;
}

type BotContext = Context & SessionFlavor<SessionData>;

// Initialize bot
const bot = new Bot<BotContext>(process.env.TELEGRAM_BOT_TOKEN!);

// Session middleware
bot.use(
  session({
    initial: (): SessionData => ({
      awaitingRecipeText: false,
      pendingRecipe: null,
    }),
  })
);

// Authorized users (add your Telegram user IDs)
const AUTHORIZED_USERS = process.env.TELEGRAM_AUTHORIZED_USERS?.split(',').map(Number) || [];

// Auth middleware
bot.use(async (ctx, next) => {
  const userId = ctx.from?.id;
  if (!userId || !AUTHORIZED_USERS.includes(userId)) {
    await ctx.reply('Sorry, you are not authorized to use this bot.');
    return;
  }
  await next();
});

// Start command
bot.command('start', async (ctx) => {
  await ctx.reply(
    `🍳 *Easy To Cook Meals Recipe Bot*\n\n` +
      `Send me a recipe URL or paste recipe text, and I'll:\n` +
      `1. Extract the recipe details\n` +
      `2. Rewrite it in our brand voice\n` +
      `3. Generate a beautiful image\n` +
      `4. Save it as a draft\n\n` +
      `*Commands:*\n` +
      `/url <link> - Import from URL\n` +
      `/paste - Paste recipe text\n` +
      `/preview - Preview pending recipe\n` +
      `/publish - Publish the recipe\n` +
      `/cancel - Cancel current operation`,
    { parse_mode: 'Markdown' }
  );
});

// Import from URL
bot.command('url', async (ctx) => {
  const url = ctx.match;
  if (!url) {
    await ctx.reply('Please provide a URL. Example: /url https://example.com/recipe');
    return;
  }

  await ctx.reply('🔍 Scraping recipe from URL...');

  try {
    // Scrape recipe
    const scrapedRecipe = await scrapeRecipe(url);
    await ctx.reply(`✅ Found recipe: *${scrapedRecipe.title}*`, { parse_mode: 'Markdown' });

    // Rewrite with AI
    await ctx.reply('✨ Rewriting in our brand voice...');
    const rewrittenRecipe = await rewriteRecipe(scrapedRecipe);
    await ctx.reply('✅ Recipe rewritten!');

    // Generate image
    await ctx.reply('🎨 Generating image...');
    const imageUrl = await generateRecipeImage(rewrittenRecipe);
    rewrittenRecipe.featured_image_url = imageUrl;
    await ctx.reply('✅ Image generated!');

    // Store in session
    ctx.session.pendingRecipe = rewrittenRecipe;

    // Show preview
    await sendRecipePreview(ctx, rewrittenRecipe);
  } catch (error: any) {
    console.error('URL import error:', error);
    await ctx.reply(`❌ Error: ${error.message}`);
  }
});

// Paste recipe text
bot.command('paste', async (ctx) => {
  ctx.session.awaitingRecipeText = true;
  await ctx.reply(
    '📝 Please paste the recipe text now.\n\n' +
      'Include:\n' +
      '- Title\n' +
      '- Ingredients list\n' +
      '- Instructions\n' +
      '- Any notes or tips'
  );
});

// Handle pasted text
bot.on('message:text', async (ctx) => {
  // Skip if it's a command
  if (ctx.message.text.startsWith('/')) return;

  // Check if we're awaiting recipe text
  if (!ctx.session.awaitingRecipeText) {
    // Check if it looks like a URL
    if (ctx.message.text.match(/^https?:\/\//)) {
      await ctx.reply('💡 Tip: Use /url <link> to import from a URL');
    }
    return;
  }

  ctx.session.awaitingRecipeText = false;
  await ctx.reply('📥 Processing recipe text...');

  try {
    // Parse the pasted text into a recipe structure
    const rawRecipe = {
      title: extractTitle(ctx.message.text),
      description: '',
      ingredients: extractIngredients(ctx.message.text),
      instructions: extractInstructions(ctx.message.text),
      source: 'manual',
    };

    // Rewrite with AI
    await ctx.reply('✨ Rewriting in our brand voice...');
    const rewrittenRecipe = await rewriteRecipe(rawRecipe);
    await ctx.reply('✅ Recipe rewritten!');

    // Generate image
    await ctx.reply('🎨 Generating image...');
    const imageUrl = await generateRecipeImage(rewrittenRecipe);
    rewrittenRecipe.featured_image_url = imageUrl;
    await ctx.reply('✅ Image generated!');

    // Store in session
    ctx.session.pendingRecipe = rewrittenRecipe;

    // Show preview
    await sendRecipePreview(ctx, rewrittenRecipe);
  } catch (error: any) {
    console.error('Text processing error:', error);
    await ctx.reply(`❌ Error: ${error.message}`);
  }
});

// Preview command
bot.command('preview', async (ctx) => {
  if (!ctx.session.pendingRecipe) {
    await ctx.reply('No pending recipe. Use /url or /paste to add one.');
    return;
  }
  await sendRecipePreview(ctx, ctx.session.pendingRecipe);
});

// Publish command
bot.command('publish', async (ctx) => {
  if (!ctx.session.pendingRecipe) {
    await ctx.reply('No pending recipe to publish. Use /url or /paste first.');
    return;
  }

  await ctx.reply('💾 Saving recipe...');

  try {
    const recipe = await saveRecipeDraft(ctx.session.pendingRecipe);
    ctx.session.pendingRecipe = null;

    await ctx.reply(
      `✅ *Recipe saved!*\n\n` +
        `Title: ${recipe.title}\n` +
        `Status: Draft\n` +
        `Slug: ${recipe.slug}\n\n` +
        `View in admin dashboard to publish.`,
      { parse_mode: 'Markdown' }
    );
  } catch (error: any) {
    console.error('Save error:', error);
    await ctx.reply(`❌ Error saving: ${error.message}`);
  }
});

// Cancel command
bot.command('cancel', async (ctx) => {
  ctx.session.pendingRecipe = null;
  ctx.session.awaitingRecipeText = false;
  await ctx.reply('❌ Operation cancelled.');
});

// Helper: Send recipe preview
async function sendRecipePreview(ctx: BotContext, recipe: any) {
  const preview =
    `📋 *Recipe Preview*\n\n` +
    `*${recipe.title}*\n\n` +
    `${recipe.description || ''}\n\n` +
    `⏱ Prep: ${recipe.prepTime || '?'} min | Cook: ${recipe.cookTime || '?'} min\n` +
    `👥 Servings: ${recipe.servings || 4}\n\n` +
    `*Ingredients:* ${recipe.ingredientGroups?.[0]?.ingredients?.length || '?'} items\n` +
    `*Steps:* ${recipe.instructions?.length || '?'} steps\n\n` +
    `Use /publish to save or /cancel to discard.`;

  if (recipe.featured_image_url) {
    await ctx.replyWithPhoto(recipe.featured_image_url, {
      caption: preview,
      parse_mode: 'Markdown',
    });
  } else {
    await ctx.reply(preview, { parse_mode: 'Markdown' });
  }
}

// Helper: Extract title from text
function extractTitle(text: string): string {
  const lines = text.split('\n').filter((l) => l.trim());
  return lines[0]?.trim() || 'Untitled Recipe';
}

// Helper: Extract ingredients from text
function extractIngredients(text: string): string[] {
  const lines = text.split('\n');
  const ingredients: string[] = [];
  let inIngredients = false;

  for (const line of lines) {
    const trimmed = line.trim().toLowerCase();
    if (trimmed.includes('ingredient')) {
      inIngredients = true;
      continue;
    }
    if (trimmed.includes('instruction') || trimmed.includes('direction') || trimmed.includes('method')) {
      inIngredients = false;
      continue;
    }
    if (inIngredients && line.trim()) {
      ingredients.push(line.trim().replace(/^[-•*]\s*/, ''));
    }
  }

  return ingredients;
}

// Helper: Extract instructions from text
function extractInstructions(text: string): string[] {
  const lines = text.split('\n');
  const instructions: string[] = [];
  let inInstructions = false;

  for (const line of lines) {
    const trimmed = line.trim().toLowerCase();
    if (trimmed.includes('instruction') || trimmed.includes('direction') || trimmed.includes('method')) {
      inInstructions = true;
      continue;
    }
    if (trimmed.includes('note') || trimmed.includes('tip')) {
      inInstructions = false;
      continue;
    }
    if (inInstructions && line.trim()) {
      instructions.push(line.trim().replace(/^\d+[\.\)]\s*/, ''));
    }
  }

  return instructions;
}

// Error handler
bot.catch((err) => {
  console.error('Bot error:', err);
});

// Export for use
export { bot };

// Start bot if running directly
if (require.main === module) {
  console.log('🤖 Starting Easy To Cook Meals Bot...');
  bot.start();
}
