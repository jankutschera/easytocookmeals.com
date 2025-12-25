import { Bot, Context, session, SessionFlavor } from 'grammy';
import { scrapeRecipe } from './scraper';
import { rewriteRecipe } from './rewriter';
import { generateRecipeImage } from './image-generator';
import { saveRecipeDraft } from './database';

// Session data interface
interface SessionData {
  awaitingRecipeText: boolean;
  awaitingInstagramCaption: boolean;
  instagramUrl: string | null;
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
      awaitingInstagramCaption: false,
      instagramUrl: null,
      pendingRecipe: null,
    }),
  })
);

// Authorized users (add your Telegram user IDs)
const AUTHORIZED_USERS = process.env.TELEGRAM_AUTHORIZED_USERS?.split(',').map(Number) || [];

// Auth middleware
bot.use(async (ctx, next) => {
  try {
    const userId = ctx.from?.id;
    console.log(`📨 Received update from user ${userId}:`, ctx.message?.text?.substring(0, 50) || ctx.update);

    if (!userId || !AUTHORIZED_USERS.includes(userId)) {
      console.log(`❌ Unauthorized user: ${userId}`);
      await ctx.reply('Sorry, you are not authorized to use this bot.');
      return;
    }
    console.log(`✅ Auth passed, calling next...`);
    await next();
    console.log(`✅ Handler completed`);
  } catch (error: any) {
    console.error(`🔥 Middleware error:`, error);
    console.error(`🔥 Stack:`, error.stack);
    await ctx.reply(`❌ Internal error: ${error.message}`);
  }
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

// Check if URL is Instagram
function isInstagramUrl(url: string): boolean {
  return url.includes('instagram.com/p/') || url.includes('instagram.com/reel/');
}

// Import from URL
bot.command('url', async (ctx) => {
  const url = ctx.match;
  if (!url) {
    await ctx.reply('Please provide a URL. Example: /url https://example.com/recipe');
    return;
  }

  // Special handling for Instagram - ask for caption
  if (isInstagramUrl(url)) {
    ctx.session.awaitingInstagramCaption = true;
    ctx.session.instagramUrl = url.split('?')[0]; // Clean URL
    await ctx.reply(
      `📸 *Instagram erkannt!*\n\n` +
      `Instagram blockiert leider automatisches Scraping. Bitte:\n\n` +
      `1. Öffne das Reel/Post in der Instagram App\n` +
      `2. Tippe auf die Caption, um sie komplett anzuzeigen\n` +
      `3. Kopiere den Text (lang drücken → "Kopieren")\n` +
      `4. Paste die Caption hier als nächste Nachricht\n\n` +
      `💡 *Tipp:* Am Desktop ist Kopieren einfacher!`,
      { parse_mode: 'Markdown' }
    );
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
  console.log('🔵 /paste command ENTERED');
  ctx.session.awaitingRecipeText = true;
  console.log('🔵 awaitingRecipeText set to true');
  await ctx.reply(
    '📝 Please paste the recipe text now.\n\n' +
      'Include:\n' +
      '- Title\n' +
      '- Ingredients list\n' +
      '- Instructions\n' +
      '- Any notes or tips'
  );
  console.log('🔵 /paste reply sent');
});

// Preview command - MUST be before message:text handler!
bot.command('preview', async (ctx) => {
  console.log('👁️ /preview command received');
  if (!ctx.session.pendingRecipe) {
    await ctx.reply('No pending recipe. Use /url or /paste to add one.');
    return;
  }
  await sendRecipePreview(ctx, ctx.session.pendingRecipe);
});

// Publish command - MUST be before message:text handler!
bot.command('publish', async (ctx) => {
  console.log('📤 /publish command received');
  console.log('📦 pendingRecipe:', ctx.session.pendingRecipe ? 'EXISTS' : 'NULL');

  if (!ctx.session.pendingRecipe) {
    console.log('⚠️ No pending recipe');
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

// Cancel command - MUST be before message:text handler!
bot.command('cancel', async (ctx) => {
  console.log('🚫 /cancel command received');
  ctx.session.pendingRecipe = null;
  ctx.session.awaitingRecipeText = false;
  ctx.session.awaitingInstagramCaption = false;
  ctx.session.instagramUrl = null;
  await ctx.reply('❌ Operation cancelled.');
});

// Handle pasted text - MUST be AFTER all command handlers!
bot.on('message:text', async (ctx) => {
  console.log('📝 message:text handler entered');
  console.log('📝 Session state:', JSON.stringify({
    awaitingRecipeText: ctx.session.awaitingRecipeText,
    awaitingInstagramCaption: ctx.session.awaitingInstagramCaption,
    hasPendingRecipe: !!ctx.session.pendingRecipe
  }));

  // Skip if it's a command - but DON'T stop the chain, let command handlers run
  if (ctx.message.text.startsWith('/')) {
    console.log('📝 Skipping - is a command, passing to command handlers');
    return; // Commands are handled by bot.command() handlers registered BEFORE this
  }

  // Handle Instagram caption paste
  if (ctx.session.awaitingInstagramCaption) {
    ctx.session.awaitingInstagramCaption = false;
    const instagramUrl = ctx.session.instagramUrl;
    ctx.session.instagramUrl = null;

    await ctx.reply('📥 Verarbeite Instagram-Rezept...');

    try {
      // Parse the caption
      const caption = ctx.message.text;
      const lines = caption.split('\n').filter(l => l.trim());
      const title = lines[0]?.replace(/[🤤💚➡️📸🍽️🌱✨]/g, '').trim() || 'Instagram Recipe';

      // Look for ingredients
      const ingredients = lines
        .filter(l => l.trim().startsWith('-') || l.trim().startsWith('•'))
        .map(l => l.replace(/^[-•]\s*/, '').trim());

      // Look for instructions
      const instructions = lines
        .filter(l => l.includes('➡️') || /^\d+[.)]/.test(l.trim()))
        .map(l => l.replace(/^➡️\s*/, '').replace(/^\d+[.)]\s*/, '').trim());

      const rawRecipe = {
        title,
        description: caption,
        ingredients,
        instructions,
        source: 'Instagram',
        sourceUrl: instagramUrl || undefined,
      };

      await ctx.reply(`✅ Rezept erkannt: *${title}*`, { parse_mode: 'Markdown' });

      // Rewrite with AI
      await ctx.reply('✨ Schreibe im Brand Voice um...');
      const rewrittenRecipe = await rewriteRecipe(rawRecipe);
      await ctx.reply('✅ Rezept umgeschrieben!');

      // Generate image
      await ctx.reply('🎨 Generiere Bild...');
      const imageUrl = await generateRecipeImage(rewrittenRecipe);
      rewrittenRecipe.featured_image_url = imageUrl;
      await ctx.reply('✅ Bild generiert!');

      // Store in session
      ctx.session.pendingRecipe = rewrittenRecipe;

      // Show preview
      await sendRecipePreview(ctx, rewrittenRecipe);
    } catch (error: any) {
      console.error('Instagram caption error:', error);
      await ctx.reply(`❌ Error: ${error.message}`);
    }
    return;
  }

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

// Catch-all for unhandled messages
bot.on('message', async (ctx) => {
  console.log('⚪ Unhandled message:', ctx.message);
});

// Error handler
bot.catch((err) => {
  console.error('🔥 Bot error:', err);
  console.error('🔥 Error stack:', err.stack);
});

// Export for use
export { bot };

// Start bot if running directly
if (require.main === module) {
  console.log('🤖 Starting Easy To Cook Meals Bot...');
  bot.start();
}
