// Test URL decoding for search
console.log('🔍 Testing URL decoding');

const testUrl = 'http://localhost:3000/search?q=sausage%20meat%2C%20egg%2C%20thyme';
const url = new URL(testUrl);
const queryParam = url.searchParams.get('q');

console.log('1. Original URL:', testUrl);
console.log('2. Decoded query param:', JSON.stringify(queryParam));
console.log('3. Query param:', queryParam);

// Parse function from search page
function parseNames(q?: string): string[] {
  return (q || "")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);
}

if (queryParam) {
  const names = parseNames(queryParam);
  console.log('4. Parsed names:', names);
  console.log('5. Display test:');
  names.forEach((name, i) => {
    console.log(`   ${i}: "${name}"`);
  });
}