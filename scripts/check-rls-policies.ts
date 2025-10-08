import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkRLSPolicies() {
  console.log('🔍 Checking RLS policies for recipe_comments table...\n');

  const { data: policies, error } = await supabase
    .from('pg_policies')
    .select('*')
    .eq('tablename', 'recipe_comments');

  if (error) {
    console.error('❌ Error fetching policies:', error);
    return;
  }

  console.log(`Found ${policies?.length || 0} policies:\n`);

  if (policies && policies.length > 0) {
    policies.forEach((policy: any) => {
      console.log('---');
      console.log('Policy Name:', policy.policyname);
      console.log('Command:', policy.cmd); // SELECT, INSERT, UPDATE, DELETE
      console.log('Permissive:', policy.permissive);
      console.log('Roles:', policy.roles);
      console.log('USING expression:', policy.qual);
      console.log('WITH CHECK expression:', policy.with_check);
      console.log();
    });
  } else {
    console.log('⚠️ No RLS policies found for recipe_comments table');
    console.log('This means users cannot read ANY comments (including their own)!\n');
  }

  // Test actual query as a user
  console.log('\n🧪 Testing comment fetch as authenticated user...');

  const userToken = 'eyJhbGciOiJIUzI1NiIsImtpZCI6IjE0cjgydWNSK3oyYzh6Q2UiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL212YmFza2ZiY3N4d3JrcXppenR0LnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiJmMmJkNjQ3Ny0wNTA2LTQ4NmMtODVhYi1lODk5ODE1ODllYmYiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzYwNTU3NTA5LCJpYXQiOjE3NTk5NTI3MDksImVtYWlsIjoiYml0ZWJ1ZGR5MkBnbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7ImF2YXRhcl91cmwiOiJodHRwczovL212YmFza2ZiY3N4d3JrcXppenR0LnN1cGFiYXNlLmNvL3N0b3JhZ2UvdjEvb2JqZWN0L3B1YmxpYy9wcm9maWxlLXBpY3R1cmVzL2F2YXRhcnMvZjJiZDY0NzctMDUwNi00ODZjLTg1YWItZTg5OTgxNTg5ZWJmLTE3NTk5Mzg2MjM0MjIuanBnIiwiZW1haWwiOiJiaXRlYnVkZHkyQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyc3RfbmFtZSI6IkpvbmF0aGFuICIsImxhc3RfbmFtZSI6IkxhaSIsIm5hbWUiOiJKb25hdGhhbiBMYWkiLCJwaG9uZV92ZXJpZmllZCI6ZmFsc2UsInN1YiI6ImYyYmQ2NDc3LTA1MDYtNDg2Yy04NWFiLWU4OTk4MTU4OWViZiJ9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6InBhc3N3b3JkIiwidGltZXN0YW1wIjoxNzU5OTUyNzA5fV0sInNlc3Npb25faWQiOiI2ZGQzZGI5Ny05MTIzLTQ2NzItOTE1MC0wYjJhZjY3MzFkMTEiLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.HMR7UDLNsVNPd4I0CG__tKVMkT0f'; // Won't work - just testing the concept

  console.log('Note: To properly test, we need to use the actual user session token');
  console.log('The frontend uses client-side Supabase with the user\'s JWT token');
}

checkRLSPolicies();
