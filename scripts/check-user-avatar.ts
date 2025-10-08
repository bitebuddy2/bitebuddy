import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkUserAvatar() {
  const userId = 'f2bd6477-0506-486c-85ab-e89981589ebf';

  console.log('🔍 Checking user avatar for user:', userId, '\n');

  // Get user details
  const { data: { user }, error } = await supabase.auth.admin.getUserById(userId);

  if (error || !user) {
    console.log('❌ Error getting user:', error);
    return;
  }

  console.log('📋 User metadata:');
  console.log('Email:', user.email);
  console.log('First name:', user.user_metadata?.first_name);
  console.log('Name:', user.user_metadata?.name);
  console.log('Avatar URL:', user.user_metadata?.avatar_url);
  console.log('\nFull user_metadata:', JSON.stringify(user.user_metadata, null, 2));

  // Check if it's a Google avatar or custom upload
  if (user.user_metadata?.avatar_url) {
    const url = user.user_metadata.avatar_url;
    if (url.includes('googleusercontent.com')) {
      console.log('\n⚠️  This is a Google OAuth avatar');
    } else if (url.includes('supabase.co')) {
      console.log('\n✅ This is a custom uploaded avatar from Supabase storage');
    } else {
      console.log('\n❓ Unknown avatar source:', url);
    }
  } else {
    console.log('\n❌ No avatar URL set');
  }

  // Check storage bucket for uploaded avatars
  console.log('\n📦 Checking profile-pictures storage bucket...');
  const { data: files, error: storageError } = await supabase.storage
    .from('profile-pictures')
    .list('avatars', { limit: 100 });

  if (storageError) {
    console.log('Error listing files:', storageError);
  } else {
    const userFiles = files?.filter(f => f.name.startsWith(userId)) || [];
    console.log(`Found ${userFiles.length} avatar(s) for this user:`);
    userFiles.forEach(f => {
      const publicUrl = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(`avatars/${f.name}`).data.publicUrl;
      console.log('  -', f.name);
      console.log('    URL:', publicUrl);
      console.log('    Size:', (f.metadata as any)?.size || 'unknown');
      console.log('    Created:', f.created_at);
    });
  }
}

checkUserAvatar();
