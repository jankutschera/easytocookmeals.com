import 'dotenv/config';
import { bot } from '../src/bot';

// Validate required environment variables
const requiredEnvVars = [
  'TELEGRAM_BOT_TOKEN',
  'TELEGRAM_AUTHORIZED_USERS',
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'ANTHROPIC_API_KEY',
];

const missing = requiredEnvVars.filter((v) => !process.env[v]);
if (missing.length > 0) {
  console.error('❌ Missing required environment variables:');
  missing.forEach((v) => console.error(`   - ${v}`));
  console.error('\nPlease add them to your .env file.');
  process.exit(1);
}

console.log('🤖 Starting Easy To Cook Meals Bot...');
console.log(`📱 Authorized users: ${process.env.TELEGRAM_AUTHORIZED_USERS}`);

// Start the bot
bot.start({
  onStart: (botInfo) => {
    console.log(`✅ Bot started as @${botInfo.username}`);
    console.log('\nBot commands:');
    console.log('  /start - Show welcome message');
    console.log('  /url <link> - Import recipe from URL');
    console.log('  /paste - Paste recipe text');
    console.log('  /preview - Preview pending recipe');
    console.log('  /publish - Save recipe to database');
    console.log('  /cancel - Cancel current operation');
  },
});

// Graceful shutdown
process.once('SIGINT', () => bot.stop());
process.once('SIGTERM', () => bot.stop());
