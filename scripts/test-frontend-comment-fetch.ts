import { createClient } from '@supabase/supabase-js';
import { createClient as createSanityClient } from '@sanity/client';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Use the ANON key like the frontend does
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const sanityClient = createSanityClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2025-09-24',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
});

async function testFrontendFetch() {
  console.log('🧪 Testing comment fetch like the frontend does...\n');

  const userId = 'f2bd6477-0506-486c-85ab-e89981589ebf'; // bitebuddy2@gmail.com

  try {
    console.log('1️⃣ Fetching comments for user:', userId);

    const { data: commentsData, error: commentsError } = await supabase
      .from('recipe_comments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (commentsError) {
      console.error('❌ Error fetching comments:', commentsError);
      console.error('Error details:', JSON.stringify(commentsError, null, 2));
      return;
    }

    console.log(`✅ Fetched ${commentsData?.length || 0} comments\n`);

    if (commentsData && commentsData.length > 0) {
      console.log('2️⃣ Processing comments...\n');

      for (const comment of commentsData) {
        console.log('---');
        console.log('Comment ID:', comment.id);
        console.log('Recipe Slug:', comment.recipe_slug || 'N/A');
        console.log('AI Recipe ID:', comment.ai_recipe_id || 'N/A');

        let recipeTitle = 'Unknown Recipe';

        try {
          if (comment.recipe_slug) {
            console.log(`  Fetching Sanity recipe for slug: ${comment.recipe_slug}`);

            try {
              const sanityRecipe = await sanityClient.fetch(
                `*[_type == "recipe" && slug.current == $slug][0]{ title }`,
                { slug: comment.recipe_slug }
              );

              if (sanityRecipe?.title) {
                recipeTitle = sanityRecipe.title;
                console.log(`  ✅ Found title: ${recipeTitle}`);
              } else {
                // Fallback to formatted slug
                recipeTitle = comment.recipe_slug
                  .split('-')
                  .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ');
                console.log(`  ⚠️ No Sanity recipe, using formatted slug: ${recipeTitle}`);
              }
            } catch (sanityError: any) {
              console.error('  ❌ Sanity fetch error:', sanityError.message);
              recipeTitle = comment.recipe_slug
                .split('-')
                .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
              console.log(`  ⚠️ Using formatted slug: ${recipeTitle}`);
            }
          } else if (comment.ai_recipe_id) {
            console.log(`  Fetching AI recipe from Supabase: ${comment.ai_recipe_id}`);
            const { data: aiRecipe } = await supabase
              .from('saved_ai_recipes')
              .select('title')
              .eq('id', comment.ai_recipe_id)
              .single();

            if (aiRecipe) {
              recipeTitle = aiRecipe.title;
              console.log(`  ✅ Found title: ${recipeTitle}`);
            } else {
              console.log(`  ⚠️ AI recipe not found`);
            }
          }
        } catch (titleError: any) {
          console.error('  ❌ Error getting recipe title:', titleError.message);
        }

        console.log(`Final title: ${recipeTitle}\n`);
      }

      console.log('✅ Test completed successfully!');
    } else {
      console.log('❌ No comments found!');
      console.log('This is the issue - the frontend query returns no results');
      console.log('Even though we know the comment exists in the database');
      console.log('\nPossible causes:');
      console.log('1. RLS policy issue with anon key');
      console.log('2. User not authenticated when fetching');
      console.log('3. userId mismatch');
    }

  } catch (error: any) {
    console.error('❌ Unexpected error:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
  }
}

testFrontendFetch();
