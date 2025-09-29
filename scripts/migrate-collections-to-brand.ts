import { client } from '../src/sanity/client'

async function migrateCollectionsToBrand() {
  console.log('🔄 Starting migration from collections to brand...')

  // 1. Find all recipes with collections
  const recipesWithCollections = await client.fetch(`
    *[_type == "recipe" && defined(collections)] {
      _id,
      title,
      collections[]->{ _id, title }
    }
  `)

  console.log(`Found ${recipesWithCollections.length} recipes with collections`)

  // 2. Find all collection documents to potentially convert to brands
  const allCollections = await client.fetch(`
    *[_type == "collection"] {
      _id,
      title,
      slug,
      description,
      heroImage
    }
  `)

  console.log(`Found ${allCollections.length} collection documents`)

  // 3. Create brands from collections (if needed)
  for (const collection of allCollections) {
    const existingBrand = await client.fetch(`
      *[_type == "brand" && title == $title][0]
    `, { title: collection.title })

    if (!existingBrand) {
      console.log(`Creating brand from collection: ${collection.title}`)
      await client.create({
        _type: 'brand',
        title: collection.title,
        slug: collection.slug,
        // Convert heroImage to logo if it exists
        ...(collection.heroImage && { logo: collection.heroImage })
      })
    }
  }

  // 4. Update recipes to use brand instead of collections
  for (const recipe of recipesWithCollections) {
    if (recipe.collections && recipe.collections.length > 0) {
      // Use the first collection as the brand (since we're moving to single brand)
      const firstCollection = recipe.collections[0]

      // Find corresponding brand
      const brand = await client.fetch(`
        *[_type == "brand" && title == $title][0]
      `, { title: firstCollection.title })

      if (brand) {
        console.log(`Updating recipe "${recipe.title}" to use brand: ${brand.title}`)

        // Update the recipe
        await client
          .patch(recipe._id)
          .set({ brand: { _ref: brand._id, _type: 'reference' } })
          .unset(['collections'])
          .commit()
      }
    }
  }

  console.log('✅ Migration complete!')
  console.log('🗑️  You can now manually delete collection documents from Sanity Studio if desired')
}

// Run the migration
migrateCollectionsToBrand().catch(console.error)