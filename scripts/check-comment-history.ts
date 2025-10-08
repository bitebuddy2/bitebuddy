import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'Set' : 'Missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkCommentHistory() {
  console.log('🔍 Checking comment history...\n');

  // Get all comments
  const { data: comments, error: commentsError } = await supabase
    .from('recipe_comments')
    .select('*')
    .order('created_at', { ascending: false });

  if (commentsError) {
    console.error('❌ Error fetching comments:', commentsError);
    return;
  }

  console.log(`✅ Found ${comments?.length || 0} total comments in database\n`);

  if (comments && comments.length > 0) {
    console.log('📋 Comment details:');
    for (const comment of comments) {
      console.log('\n---');
      console.log('Comment ID:', comment.id);
      console.log('User ID:', comment.user_id);
      console.log('User Name:', comment.user_name);
      console.log('User Avatar:', comment.user_avatar || 'No avatar');
      console.log('Recipe Slug:', comment.recipe_slug || 'N/A');
      console.log('AI Recipe ID:', comment.ai_recipe_id || 'N/A');
      console.log('Comment Text:', comment.comment_text.substring(0, 50) + '...');
      console.log('Created At:', comment.created_at);
      console.log('Image URL:', comment.image_url || 'No image');
    }

    // Check for Greggs Festive Bake specifically
    console.log('\n\n🔍 Looking for Greggs Festive Bake comments...');
    const greggComments = comments.filter(c =>
      c.recipe_slug?.includes('greggs') ||
      c.recipe_slug?.includes('festive') ||
      c.recipe_slug?.includes('bake')
    );

    if (greggComments.length > 0) {
      console.log(`✅ Found ${greggComments.length} comment(s) related to Greggs Festive Bake`);
      greggComments.forEach(c => {
        console.log('  - Slug:', c.recipe_slug);
        console.log('  - User:', c.user_name);
      });
    } else {
      console.log('❌ No comments found for Greggs Festive Bake');
      console.log('\nAll recipe slugs in comments:');
      const uniqueSlugs = [...new Set(comments.map(c => c.recipe_slug).filter(Boolean))];
      uniqueSlugs.forEach(slug => console.log('  -', slug));
    }
  }

  // Check users
  console.log('\n\n👤 Checking users...');
  const { data: users, error: usersError } = await supabase.auth.admin.listUsers();

  if (usersError) {
    console.error('❌ Error fetching users:', usersError);
  } else {
    console.log(`✅ Found ${users.users.length} total users`);
    users.users.forEach(user => {
      console.log('\n---');
      console.log('User ID:', user.id);
      console.log('Email:', user.email);
      console.log('Avatar URL:', user.user_metadata?.avatar_url || 'No avatar set');
      console.log('First Name:', user.user_metadata?.first_name || 'N/A');
      console.log('Name:', user.user_metadata?.name || 'N/A');

      // Count comments for this user
      const userComments = comments?.filter(c => c.user_id === user.id) || [];
      console.log('Comments Count:', userComments.length);
    });
  }
}

checkCommentHistory();
