import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkSavedRecipesRLS() {
  console.log('🔍 Checking saved_recipes table and RLS policies...\n');

  // Check if table exists
  const { data: tableExists, error: tableError } = await supabase
    .from('saved_recipes')
    .select('*')
    .limit(1);

  if (tableError) {
    console.error('❌ Error accessing saved_recipes table:', tableError);
    console.log('\nPossible issues:');
    console.log('1. Table does not exist');
    console.log('2. RLS is blocking access');
    console.log('3. Policies are misconfigured');
    return;
  }

  console.log('✅ saved_recipes table exists and is accessible\n');

  // Get RLS status
  const { data: rlsStatus } = await supabase
    .rpc('exec_sql', {
      sql: `SELECT relrowsecurity FROM pg_class WHERE relname = 'saved_recipes'`
    })
    .single();

  console.log('RLS Enabled:', rlsStatus ? 'Yes' : 'Unknown\n');

  // Get all policies
  console.log('📋 Current RLS Policies:\n');
  const { data: policies } = await supabase
    .rpc('exec_sql', {
      sql: `
        SELECT
          policyname,
          cmd,
          permissive,
          roles,
          qual,
          with_check
        FROM pg_policies
        WHERE tablename = 'saved_recipes'
        ORDER BY policyname
      `
    });

  if (policies && policies.length > 0) {
    policies.forEach((policy: any) => {
      console.log('---');
      console.log('Policy Name:', policy.policyname);
      console.log('Command:', policy.cmd);
      console.log('Permissive:', policy.permissive);
      console.log('Roles:', policy.roles);
      console.log('USING:', policy.qual);
      console.log('WITH CHECK:', policy.with_check);
      console.log();
    });
  } else {
    console.log('❌ No policies found!\n');
  }

  // Check table structure
  console.log('\n📊 Table Structure:\n');
  const { data: columns } = await supabase
    .rpc('exec_sql', {
      sql: `
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_name = 'saved_recipes'
        ORDER BY ordinal_position
      `
    });

  if (columns && columns.length > 0) {
    columns.forEach((col: any) => {
      console.log(`- ${col.column_name} (${col.data_type})`);
    });
  }
}

checkSavedRecipesRLS();
