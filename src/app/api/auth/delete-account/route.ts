import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function DELETE(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Create a Supabase client with the user's token to verify authentication
    const supabaseClient = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    // Verify the user is authenticated
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Create admin client for deletions
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Delete user's data from various tables
    // Note: Adjust table names based on your schema
    const userId = user.id;

    // Delete saved recipes
    await supabaseAdmin.from('saved_recipes').delete().eq('user_id', userId);

    // Delete saved AI recipes
    await supabaseAdmin.from('saved_ai_recipes').delete().eq('user_id', userId);

    // Delete meal plans
    await supabaseAdmin.from('meal_plans').delete().eq('user_id', userId);

    // Delete recipe ratings
    await supabaseAdmin.from('recipe_ratings').delete().eq('user_id', userId);

    // Delete subscription info
    await supabaseAdmin.from('subscriptions').delete().eq('user_id', userId);

    // Delete the user's avatar from storage if it exists
    const avatarUrl = user.user_metadata?.avatar_url;
    if (avatarUrl && avatarUrl.includes('supabase')) {
      const pathMatch = avatarUrl.match(/avatars\/(.+)$/);
      if (pathMatch) {
        const filePath = pathMatch[1];
        await supabaseAdmin.storage.from('avatars').remove([filePath]);
      }
    }

    // Finally, delete the user account
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (deleteError) {
      console.error('Error deleting user:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete account' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Account successfully deleted' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete account error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
