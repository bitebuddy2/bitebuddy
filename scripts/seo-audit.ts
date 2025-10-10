/**
 * SEO Audit Script - Check all pages for SEO optimization
 */

interface PageAudit {
  page: string;
  title?: string;
  description?: string;
  hasMetadata: boolean;
  hasCanonical?: boolean;
  hasOpenGraph?: boolean;
  hasTwitter?: boolean;
  issues: string[];
}

const pages: PageAudit[] = [];

// Helper function to check string length
function checkLength(text: string | undefined, min: number, max: number, label: string): string[] {
  const issues: string[] = [];
  if (!text) {
    issues.push(`Missing ${label}`);
  } else {
    if (text.length < min) {
      issues.push(`${label} too short (${text.length} chars, min ${min})`);
    }
    if (text.length > max) {
      issues.push(`${label} too long (${text.length} chars, max ${max})`);
    }
  }
  return issues;
}

// Pages to audit
const audit = {
  '/': {
    title: 'UK Copycat Recipes & AI Recipe Generator | Bite Buddy',
    description: 'Recreate your favourite UK restaurant dishes from Greggs, Nando\'s, Wagamama & more. Plus, use our free AI Recipe Generator to create personalized meal ideas in seconds.',
  },
  '/recipes': {
    title: 'All UK Copycat Recipes | Bite Buddy',
    description: 'Browse our complete collection of UK restaurant copycat recipes from Greggs, Nando\'s, Wagamama, KFC, McDonald\'s, Costa, and more. Find your favourite dishes to recreate at home.',
  },
  '/ai-recipe-generator': {
    title: null, // Missing!
    description: null, // Missing!
  },
  '/about': {
    title: null, // Missing!
    description: null, // Missing!
  },
  '/premium': {
    title: null, // Missing!
    description: null, // Missing!
  },
  '/contact': {
    title: 'Contact Us',
    description: 'Get in touch with BiteBuddy for recipe requests, questions, or feedback.',
  },
  '/search': {
    title: null, // Missing!
    description: null, // Missing!
  },
};

console.log('🔍 SEO AUDIT REPORT\n');
console.log('=' .repeat(80));

for (const [page, meta] of Object.entries(audit)) {
  const pageAudit: PageAudit = {
    page,
    title: meta.title || undefined,
    description: meta.description || undefined,
    hasMetadata: !!(meta.title && meta.description),
    issues: [],
  };

  // Check title
  pageAudit.issues.push(...checkLength(meta.title || undefined, 30, 60, 'Title'));

  // Check description
  pageAudit.issues.push(...checkLength(meta.description || undefined, 120, 160, 'Description'));

  pages.push(pageAudit);
}

// Print results
for (const page of pages) {
  console.log(`\nPage: ${page.page}`);
  console.log(`Title: ${page.title || '❌ MISSING'}`);
  console.log(`Description: ${page.description || '❌ MISSING'}`);

  if (page.issues.length > 0) {
    console.log('⚠️  Issues:');
    page.issues.forEach(issue => console.log(`   - ${issue}`));
  } else {
    console.log('✅ No issues');
  }
}

console.log('\n' + '='.repeat(80));
console.log('\n📊 SUMMARY\n');

const totalPages = pages.length;
const pagesWithIssues = pages.filter(p => p.issues.length > 0).length;
const pagesWithoutMetadata = pages.filter(p => !p.hasMetadata).length;

console.log(`Total pages audited: ${totalPages}`);
console.log(`Pages with issues: ${pagesWithIssues}`);
console.log(`Pages missing metadata: ${pagesWithoutMetadata}`);

console.log('\n🎯 RECOMMENDATIONS:\n');
console.log('1. Add metadata to all pages without title/description');
console.log('2. Ensure titles are 30-60 characters');
console.log('3. Ensure descriptions are 120-160 characters');
console.log('4. Add OpenGraph and Twitter Card metadata');
console.log('5. Verify canonical URLs on all pages');
console.log('6. Add structured data (JSON-LD) where appropriate');
