const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const titleUpdates = [
  { slug: 'vegan-mozzarella', title: 'Easy Vegan Mozzarella (Melts Perfectly!)' },
  { slug: 'vegan-raclette-cheese', title: 'Homemade Vegan Raclette (Fondue-Ready in 30 Min)' },
  { slug: 'overnight-oatmeal', title: '5-Minute Prep Overnight Oats (Grab & Go)' },
  { slug: 'vegan-oreos', title: 'Homemade Vegan Oreos (Healthier & Delicious)' },
  { slug: 'dinner-rolls', title: 'Fluffy Vegan Dinner Rolls (Better Than Bakery)' },
  { slug: 'vegan-asian-beef-broccoli', title: 'Quick Vegan Beef & Broccoli (Crock Pot Magic)' },
  { slug: 'vegan-turkey-pasta-sauce', title: 'Hearty Vegan Pasta Sauce (Italian Comfort)' },
  { slug: 'vegan-sweet-potato-plantain-bowl', title: '30-Minute Sweet Potato & Plantain Power Bowl' },
  { slug: 'zucchini-carrot-crustless-pizza', title: 'Low-Carb Veggie Pizza (No Crust Needed!)' },
  { slug: 'authentic-falafel', title: 'Crispy Homemade Falafel (Street Food at Home)' },
  { slug: 'tropical-coconut-chia-pudding', title: 'Make-Ahead Tropical Chia Pudding (Meal Prep Hero)' },
  { slug: 'watermelon-kiwi-smoothie', title: 'Refreshing Watermelon Kiwi Smoothie (5 Ingredients)' },
];

async function updateTitles() {
  console.log('Updating recipe titles to benefit-focused versions...\n');

  for (const { slug, title } of titleUpdates) {
    const { data, error } = await supabase
      .from('recipes')
      .update({ title })
      .eq('slug', slug)
      .select('slug, title');

    if (error) {
      console.log(`❌ ${slug}: ${error.message}`);
    } else if (data && data.length > 0) {
      console.log(`✅ ${slug} → "${title}"`);
    } else {
      console.log(`⚠️  ${slug}: Recipe not found (may not exist yet)`);
    }
  }

  console.log('\nDone!');
}

updateTitles();
