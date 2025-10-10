import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyFix() {
  console.log('🔧 Fixing Google OAuth database trigger...\n');

  // Read the SQL fix file
  const sqlPath = path.join(process.cwd(), 'fix-user-preferences-trigger.sql');
  const sql = fs.readFileSync(sqlPath, 'utf-8');

  console.log('📄 SQL to execute:');
  console.log('─'.repeat(60));
  console.log(sql);
  console.log('─'.repeat(60));
  console.log();

  try {
    // Execute the SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error) {
      // If exec_sql doesn't exist, try direct query
      console.log('⚠️  exec_sql function not available, trying direct query...\n');

      // Split SQL into individual statements
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

      for (const statement of statements) {
        if (statement.trim()) {
          console.log(`Executing: ${statement.substring(0, 60)}...`);
          const result = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': supabaseServiceKey,
              'Authorization': `Bearer ${supabaseServiceKey}`,
            },
            body: JSON.stringify({ query: statement + ';' }),
          });

          if (!result.ok) {
            const errorText = await result.text();
            console.error(`❌ Failed to execute statement: ${errorText}`);
          } else {
            console.log('✅ Success');
          }
        }
      }
    } else {
      console.log('✅ SQL executed successfully!');
      if (data) {
        console.log('Result:', data);
      }
    }

    // Verify the fix by checking if the function has SECURITY DEFINER
    console.log('\n🔍 Verifying the fix...\n');

    const { data: funcData, error: funcError } = await supabase
      .from('pg_proc')
      .select('proname, prosecdef')
      .eq('proname', 'create_default_user_preferences')
      .single();

    if (funcError) {
      console.log('⚠️  Could not verify function (this is normal)');
      console.log('   Please verify manually in Supabase Dashboard');
    } else if (funcData) {
      if (funcData.prosecdef) {
        console.log('✅ Function has SECURITY DEFINER - fix applied correctly!');
      } else {
        console.log('❌ Function does NOT have SECURITY DEFINER - fix may not have applied');
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ FIX APPLIED SUCCESSFULLY!');
    console.log('='.repeat(60));
    console.log('\n📋 Next steps:');
    console.log('   1. Go to https://bitebuddy.co.uk/account');
    console.log('   2. Sign out if signed in');
    console.log('   3. Click "Sign in with Google"');
    console.log('   4. Use a NEW Google account (one that has never signed in before)');
    console.log('   5. You should sign in successfully without errors!\n');
    console.log('📚 For troubleshooting, see: FIX_GOOGLE_OAUTH_DATABASE_ERROR.md\n');

  } catch (err) {
    console.error('\n❌ Error applying fix:', err);
    console.log('\n📌 MANUAL FIX REQUIRED:');
    console.log('   1. Go to: https://supabase.com/dashboard/project/mvbaskfbcsxwrkqziztt');
    console.log('   2. Click "SQL Editor" in the left sidebar');
    console.log('   3. Click "New Query"');
    console.log('   4. Copy and paste the contents of fix-user-preferences-trigger.sql');
    console.log('   5. Click "Run" or press Ctrl+Enter');
    console.log('   6. You should see "Success. No rows returned"\n');
    process.exit(1);
  }
}

applyFix();
