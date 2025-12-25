// Test Supabase connection
import 'dotenv/config';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Testing Supabase connection...');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey?.substring(0, 20) + '...');

async function test() {
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        'apikey': supabaseKey!,
        'Authorization': `Bearer ${supabaseKey}`,
      },
    });

    console.log('Status:', response.status);
    const data = await response.text();
    console.log('Response:', data.substring(0, 200));

    if (response.ok) {
      console.log('✅ Connection successful!');
    } else {
      console.log('❌ Connection failed');
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

test();
