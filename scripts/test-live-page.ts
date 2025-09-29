// scripts/test-live-page.ts
// Simple test to verify recipe page is working correctly

import fetch from "node-fetch";

async function testLivePage() {
  try {
    console.log("🌐 Testing live recipe page at http://localhost:3003...\n");

    const response = await fetch("http://localhost:3003/recipes/greggs-sausage-roll-homemade-copycat");

    if (!response.ok) {
      console.log(`❌ HTTP ${response.status}: ${response.statusText}`);
      return;
    }

    const html = await response.text();

    // Check for ingredient names in the HTML
    const hasIngredients = html.includes("Fine sea salt") && html.includes("Sausage meat");
    const hasNullIngredients = html.includes("null") || html.includes("Ingredient");

    console.log("📄 Recipe page loaded successfully!");
    console.log(`✅ Contains expected ingredients: ${hasIngredients}`);
    console.log(`🔍 Contains 'null' or fallback text: ${hasNullIngredients}`);

    if (hasIngredients && !hasNullIngredients) {
      console.log("\n🎉 SUCCESS: Recipe page is displaying ingredient names correctly!");
    } else if (hasNullIngredients) {
      console.log("\n⚠️  WARNING: Found 'null' or fallback ingredient text in the page");

      // Extract and show problematic sections
      const lines = html.split('\n');
      const problematicLines = lines.filter(line =>
        line.includes('null') || (line.includes('Ingredient') && !line.includes('Ingredients'))
      );

      if (problematicLines.length > 0) {
        console.log("Problematic lines:");
        problematicLines.forEach(line => {
          console.log(`  ${line.trim()}`);
        });
      }
    } else {
      console.log("\n❓ UNKNOWN: Could not find expected ingredient names in the page");
    }

  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

testLivePage();