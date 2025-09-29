#!/usr/bin/env tsx
/**
 * Script to set up Sanity webhooks for automatic nutrition recalculation
 *
 * This script creates webhooks that trigger whenever:
 * - A recipe document is created/updated/deleted
 * - An ingredient document is created/updated/deleted
 *
 * The webhooks will call our /api/recalc-nutrition endpoint to automatically
 * recalculate nutrition whenever recipes or their ingredients change.
 */

import { config } from 'dotenv'
import { createClient } from '@sanity/client'

// Load environment variables from .env.local
config({ path: '.env.local' })

// Configuration
const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET!
const SANITY_TOKEN = process.env.SANITY_WRITE_TOKEN!
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL!
const WEBHOOK_SECRET = process.env.NUTRITION_WEBHOOK_SECRET || ''

if (!SANITY_PROJECT_ID || !SANITY_DATASET || !SANITY_TOKEN || !SITE_URL) {
  console.error('Missing required environment variables:')
  console.error('- NEXT_PUBLIC_SANITY_PROJECT_ID')
  console.error('- NEXT_PUBLIC_SANITY_DATASET')
  console.error('- SANITY_WRITE_TOKEN')
  console.error('- NEXT_PUBLIC_SITE_URL')
  process.exit(1)
}

// Create management client for webhook operations
const managementClient = createClient({
  projectId: SANITY_PROJECT_ID,
  token: SANITY_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
  useProjectHostname: false,
})

// Webhook configuration
const webhookUrl = `${SITE_URL}/api/recalc-nutrition${WEBHOOK_SECRET ? `?secret=${WEBHOOK_SECRET}` : ''}`

const webhooks = [
  {
    name: 'Nutrition Recalc - Recipe Changes',
    description: 'Automatically recalculate nutrition when recipes are modified',
    url: webhookUrl,
    trigger: {
      filter: '_type == "recipe"',
      includeDrafts: false,
    },
    httpMethod: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  },
  {
    name: 'Nutrition Recalc - Ingredient Changes',
    description: 'Recalculate nutrition for all recipes when ingredients are modified',
    url: `${SITE_URL}/api/recalc-nutrition/ingredient-changed${WEBHOOK_SECRET ? `?secret=${WEBHOOK_SECRET}` : ''}`,
    trigger: {
      filter: '_type == "ingredient"',
      includeDrafts: false,
    },
    httpMethod: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  }
]

async function setupWebhooks() {
  console.log('🔧 Setting up Sanity webhooks for automatic nutrition recalculation...')
  console.log(`📍 Target URL: ${webhookUrl}`)

  try {
    // Get existing webhooks to avoid duplicates
    const existingWebhooks = await managementClient.request({
      uri: `/projects/${SANITY_PROJECT_ID}/hooks`,
      method: 'GET',
    })

    console.log(`📋 Found ${existingWebhooks.length} existing webhooks`)

    for (const webhook of webhooks) {
      // Check if webhook already exists
      const existing = existingWebhooks.find((w: any) => w.name === webhook.name)

      if (existing) {
        console.log(`⚠️  Webhook "${webhook.name}" already exists (ID: ${existing.id})`)

        // Update existing webhook
        const updated = await managementClient.request({
          uri: `/projects/${SANITY_PROJECT_ID}/hooks/${existing.id}`,
          method: 'PUT',
          body: webhook,
        })

        console.log(`✅ Updated webhook "${webhook.name}"`)
      } else {
        // Create new webhook
        const created = await managementClient.request({
          uri: `/projects/${SANITY_PROJECT_ID}/hooks`,
          method: 'POST',
          body: webhook,
        })

        console.log(`🆕 Created webhook "${webhook.name}" (ID: ${created.id})`)
      }
    }

    console.log('\n🎉 Webhook setup complete!')
    console.log('\n📝 Summary:')
    console.log('- Recipe changes will automatically trigger nutrition recalculation')
    console.log('- Ingredient changes will trigger recalculation for all affected recipes')
    console.log('- Webhooks are secured with secret if NUTRITION_WEBHOOK_SECRET is set')

  } catch (error) {
    console.error('❌ Error setting up webhooks:', error)
    process.exit(1)
  }
}

async function listWebhooks() {
  try {
    const webhooks = await managementClient.request({
      uri: `/projects/${SANITY_PROJECT_ID}/hooks`,
      method: 'GET',
    })

    console.log('\n📋 Current webhooks:')
    webhooks.forEach((webhook: any) => {
      console.log(`- ${webhook.name} (${webhook.id})`)
      console.log(`  URL: ${webhook.url}`)
      console.log(`  Filter: ${webhook.trigger?.filter || 'N/A'}`)
      console.log('')
    })

  } catch (error) {
    console.error('❌ Error listing webhooks:', error)
  }
}

// Main execution
async function main() {
  const command = process.argv[2]

  switch (command) {
    case 'setup':
      await setupWebhooks()
      break
    case 'list':
      await listWebhooks()
      break
    default:
      console.log('Usage:')
      console.log('  npm run setup-webhooks setup  # Create/update webhooks')
      console.log('  npm run setup-webhooks list   # List current webhooks')
      break
  }
}

main().catch(console.error)