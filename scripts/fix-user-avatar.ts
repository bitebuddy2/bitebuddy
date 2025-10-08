import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function fixUserAvatar() {
  const userId = 'f2bd6477-0506-486c-85ab-e89981589ebf';

  console.log('🔧 Fixing user avatar...\n');

  // Get the most recent uploaded avatar
  const { data: files, error: storageError } = await supabase.storage
    .from('profile-pictures')
    .list('avatars', { limit: 100 });

  if (storageError) {
    console.log('❌ Error listing files:', storageError);
    return;
  }

  const userFiles = (files || [])
    .filter(f => f.name.startsWith(userId))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  if (userFiles.length === 0) {
    console.log('❌ No uploaded avatars found for this user');
    return;
  }

  const latestFile = userFiles[0];
  const publicUrl = supabase.storage
    .from('profile-pictures')
    .getPublicUrl(`avatars/${latestFile.name}`).data.publicUrl;

  console.log('📸 Latest uploaded avatar:', latestFile.name);
  console.log('🔗 URL:', publicUrl);
  console.log('📅 Uploaded:', latestFile.created_at);

  // Update user metadata
  console.log('\n🔄 Updating user metadata...');

  const { data: { user }, error: getUserError } = await supabase.auth.admin.getUserById(userId);

  if (getUserError || !user) {
    console.log('❌ Error getting user:', getUserError);
    return;
  }

  const { data: updatedUser, error: updateError } = await supabase.auth.admin.updateUserById(
    userId,
    {
      user_metadata: {
        ...user.user_metadata,
        avatar_url: publicUrl,
      },
    }
  );

  if (updateError) {
    console.log('❌ Error updating metadata:', updateError);
    console.log('Error details:', JSON.stringify(updateError, null, 2));
    return;
  }

  console.log('✅ User metadata updated successfully!');
  console.log('New avatar_url:', updatedUser.user?.user_metadata?.avatar_url);
  console.log('\n✨ Done! The profile picture should now show correctly.');
  console.log('💡 You may need to refresh the page or sign out/in again.');
}

fixUserAvatar();
