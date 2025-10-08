import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set');
  process.exit(1);
}

async function applyMigration() {
  console.log('🚀 Starting user preferences migration...\n');

  // Read the migration file
  const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '20250109000002_create_user_preferences.sql');
  const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');

  console.log('📄 Migration file loaded');
  console.log('📊 Executing SQL via REST API...\n');

  try {
    // Use Supabase REST API to execute SQL
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
      },
      body: JSON.stringify({ sql: migrationSQL }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    console.log('\n✅ Migration applied successfully!');
    console.log('\n📋 Created:');
    console.log('  ✓ user_preferences table');
    console.log('  ✓ RLS policies');
    console.log('  ✓ Indexes');
    console.log('  ✓ Trigger functions');
    console.log('  ✓ Auto-creation trigger for new users');
    console.log('\n🎉 Settings features are now ready to use!\n');

  } catch (error: any) {
    console.error('\n❌ Migration failed:', error.message);
    console.error('\n📝 Please apply the migration manually instead:');
    console.error('\n1. Go to https://app.supabase.com');
    console.error('2. Select your project');
    console.error('3. Click "SQL Editor" in the left sidebar');
    console.error('4. Click "New Query"');
    console.error('5. Copy and paste the contents of:');
    console.error('   supabase/migrations/20250109000002_create_user_preferences.sql');
    console.error('6. Click "Run" or press Ctrl+Enter');
    console.error('\n💡 The migration SQL is printed below:\n');
    console.log('─'.repeat(80));
    console.log(migrationSQL);
    console.log('─'.repeat(80));
    process.exit(1);
  }
}

applyMigration();
