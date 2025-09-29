import { client } from '../src/sanity/client'

async function cleanupCollections() {
  console.log('🧹 Cleaning up collections data...')

  // Remove collections field from all recipes
  const recipesWithCollections = await client.fetch(`
    *[_type == "recipe" && defined(collections)] {
      _id,
      title
    }
  `)

  console.log(`Found ${recipesWithCollections.length} recipes with collections to clean`)

  for (const recipe of recipesWithCollections) {
    console.log(`Removing collections from: ${recipe.title}`)
    await client
      .patch(recipe._id)
      .unset(['collections'])
      .commit()
  }

  console.log('✅ Collections field removed from all recipes')
  console.log('ℹ️  You can manually delete collection documents from Sanity Studio if desired')
}

// Run the cleanup
cleanupCollections().catch(console.error)