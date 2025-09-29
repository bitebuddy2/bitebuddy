#!/usr/bin/env tsx
/**
 * Script to test webhook endpoints with real data from the database
 */

import { config } from 'dotenv'
import { createClient } from '@sanity/client'

// Load environment variables from .env.local
config({ path: '.env.local' })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!
const token = process.env.SANITY_WRITE_TOKEN!
const webhookSecret = process.env.NUTRITION_WEBHOOK_SECRET!
const ngrokUrl = 'https://interspatial-susanna-percussively.ngrok-free.dev'

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2023-01-01',
  useCdn: false
})

async function testWebhooks() {
  console.log('🧪 Testing webhook endpoints with real data...\n')

  try {
    // Get a real recipe ID
    const recipes = await client.fetch(`*[_type == "recipe"][0...2]{_id, title}`)
    console.log(`📋 Found ${recipes.length} recipes:`)
    recipes.forEach((recipe: any) => {
      console.log(`  - ${recipe.title} (${recipe._id})`)
    })

    // Get a real ingredient ID
    const ingredients = await client.fetch(`*[_type == "ingredient"][0...2]{_id, name}`)
    console.log(`\n🥄 Found ${ingredients.length} ingredients:`)
    ingredients.forEach((ingredient: any) => {
      console.log(`  - ${ingredient.name} (${ingredient._id})`)
    })

    if (recipes.length > 0) {
      console.log(`\n🔄 Testing recipe recalculation with: ${recipes[0].title}`)

      const recipeResponse = await fetch(`${ngrokUrl}/api/recalc-nutrition?secret=${webhookSecret}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipeId: recipes[0]._id })
      })

      const recipeResult = await recipeResponse.json()
      console.log('Recipe webhook result:', recipeResult)
    }

    if (ingredients.length > 0) {
      console.log(`\n🔄 Testing ingredient change with: ${ingredients[0].name}`)

      const ingredientResponse = await fetch(`${ngrokUrl}/api/recalc-nutrition/ingredient-changed?secret=${webhookSecret}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: ingredients[0]._id })
      })

      const ingredientResult = await ingredientResponse.json()
      console.log('Ingredient webhook result:', ingredientResult)
    }

    console.log('\n✅ Webhook testing completed!')

  } catch (error) {
    console.error('❌ Error testing webhooks:', error)
  }
}

testWebhooks()