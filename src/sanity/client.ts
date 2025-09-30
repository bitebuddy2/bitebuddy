import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from './env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Use CDN for faster public reads
  token: process.env.SANITY_WRITE_TOKEN, // Add token for reference dereferencing
  perspective: 'published', // Only fetch published documents
})
