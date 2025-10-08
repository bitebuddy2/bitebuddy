import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkSchema() {
  console.log('🔍 Checking saved_ai_recipes table schema...\n');

  // Get one record with all columns
  const { data, error } = await supabase
    .from('saved_ai_recipes')
    .select('*')
    .limit(1);

  if (error) {
    console.log('❌ Error:', error);
  } else if (data && data.length > 0) {
    console.log('📋 All columns in the table:');
    console.log(Object.keys(data[0]).sort());

    console.log('\n✅ Has updated_at?', 'updated_at' in data[0]);
  } else {
    console.log('No data in table');
  }
}

checkSchema();
