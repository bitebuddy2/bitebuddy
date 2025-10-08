import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from './env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Disable CDN for write operations
  token: process.env.SANITY_WRITE_TOKEN, // Token for write operations
  perspective: 'published', // Only fetch published documents
})
