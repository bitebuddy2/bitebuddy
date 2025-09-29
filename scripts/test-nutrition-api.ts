#!/usr/bin/env tsx
/**
 * Test script for nutrition recalculation API endpoints
 *
 * This script helps you test the nutrition recalculation endpoints
 * before setting up the Sanity webhooks.
 */

import { config } from 'dotenv'
import { groq } from 'next-sanity'
import { createClient } from '@sanity/client'

// Load environment variables
config({ path: '.env.local' })

// Create client for testing
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: false,
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
const WEBHOOK_SECRET = process.env.NUTRITION_WEBHOOK_SECRET || ''

// Helper to make API requests
async function makeRequest(endpoint: string, data: any) {
  const url = `${SITE_URL}${endpoint}${WEBHOOK_SECRET ? `?secret=${WEBHOOK_SECRET}` : ''}`

  console.log(`🔄 Testing: ${endpoint}`)
  console.log(`📍 URL: ${url}`)
  console.log(`📦 Data:`, JSON.stringify(data, null, 2))

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (response.ok) {
      console.log(`✅ Success (${response.status}):`, result)
    } else {
      console.log(`❌ Error (${response.status}):`, result)
    }

    return { success: response.ok, status: response.status, data: result }

  } catch (error) {
    console.log(`💥 Network Error:`, error)
    return { success: false, error }
  }
}

// Get a sample recipe and ingredient for testing
async function getSampleData() {
  console.log('🔍 Finding sample recipe and ingredient for testing...')

  try {
    // Get first recipe
    const recipe = await client.fetch(groq`
      *[_type == "recipe"][0]{
        _id,
        title,
        servings
      }
    `)

    // Get first ingredient
    const ingredient = await client.fetch(groq`
      *[_type == "ingredient"][0]{
        _id,
        name
      }
    `)

    return { recipe, ingredient }

  } catch (error) {
    console.log('❌ Error fetching sample data:', error)
    return { recipe: null, ingredient: null }
  }
}

async function testRecipeEndpoint(recipeId: string) {
  console.log('\n📝 Testing Recipe Nutrition Recalculation...')
  console.log('=' .repeat(50))

  const result = await makeRequest('/api/recalc-nutrition', {
    recipeId: recipeId
  })

  return result
}

async function testIngredientEndpoint(ingredientId: string) {
  console.log('\n🥕 Testing Ingredient Change Recalculation...')
  console.log('=' .repeat(50))

  const result = await makeRequest('/api/recalc-nutrition/ingredient-changed', {
    ingredientId: ingredientId
  })

  return result
}

async function testWithSampleData() {
  const { recipe, ingredient } = await getSampleData()

  if (!recipe || !ingredient) {
    console.log('❌ Could not find sample data. Please create at least one recipe and one ingredient in Sanity Studio.')
    return
  }

  console.log(`📋 Found sample recipe: "${recipe.title}" (${recipe._id})`)
  console.log(`📋 Found sample ingredient: "${ingredient.name}" (${ingredient._id})`)

  // Test recipe endpoint
  const recipeResult = await testRecipeEndpoint(recipe._id)

  // Test ingredient endpoint
  const ingredientResult = await testIngredientEndpoint(ingredient._id)

  // Summary
  console.log('\n📊 Test Summary')
  console.log('=' .repeat(50))
  console.log(`Recipe endpoint: ${recipeResult.success ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`Ingredient endpoint: ${ingredientResult.success ? '✅ PASS' : '❌ FAIL'}`)

  if (recipeResult.success && ingredientResult.success) {
    console.log('\n🎉 All tests passed! Your nutrition API is ready for webhooks.')
    console.log('👉 Next step: Set up webhooks in Sanity Dashboard (see WEBHOOK_SETUP.md)')
  } else {
    console.log('\n⚠️  Some tests failed. Check the errors above and ensure:')
    console.log('   - Your dev server is running (npm run dev)')
    console.log('   - Environment variables are set correctly')
    console.log('   - You have recipes and ingredients in Sanity')
  }
}

async function testWithCustomIds() {
  const recipeId = process.argv[3]
  const ingredientId = process.argv[4]

  if (!recipeId) {
    console.log('❌ Please provide a recipe ID')
    console.log('Usage: npm run test-nutrition recipe <recipeId> [ingredientId]')
    return
  }

  await testRecipeEndpoint(recipeId)

  if (ingredientId) {
    await testIngredientEndpoint(ingredientId)
  }
}

// Main execution
async function main() {
  console.log('🧪 Nutrition API Test Suite')
  console.log('=' .repeat(50))
  console.log(`🌐 Target: ${SITE_URL}`)
  console.log(`🔐 Secret: ${WEBHOOK_SECRET ? 'Set' : 'Not set'}`)

  const command = process.argv[2]

  switch (command) {
    case 'auto':
      await testWithSampleData()
      break
    case 'recipe':
      await testWithCustomIds()
      break
    default:
      console.log('\nUsage:')
      console.log('  npm run test-nutrition auto              # Auto-test with sample data')
      console.log('  npm run test-nutrition recipe <id>       # Test specific recipe')
      console.log('  npm run test-nutrition recipe <id> <ing> # Test recipe + ingredient')
      break
  }
}

main().catch(console.error)